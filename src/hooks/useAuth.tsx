import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useRef
} from 'react';
import { supabase } from '@/integrations/supabase/client'; // getypeerd met Database
import type { User, AuthError, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { useSessionRevalidation } from './useSessionRevalidation';
import { useTabSyncSession } from './useTabSyncSession';
import { captureReferralInfo } from '@/utils/referralTracking';
import { useQueryClient } from '@tanstack/react-query';



// UserProfile type from database schema
export type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authLoading: boolean; // Alias for loading for clarity
  emailVerified: boolean; // Email verification status
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: 'admin' | 'staff'
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthContext for direct access when needed (e.g., during hot reload)
export { AuthContext };

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}




export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  // ✅ THE SECURITY FIX: Clears data so new users don't see old data
  const purgeAllData = () => {
    console.log('[Security] Purging React Query Cache');
    queryClient.clear();
  };

  const fetchAndSetProfile = async (userId: string, email?: string, userMetadata?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        // Profile doesn't exist, create one (for OAuth users or edge cases)
        const firstName = userMetadata?.first_name || userMetadata?.full_name?.split(' ')[0] || '';
        const lastName = userMetadata?.last_name || userMetadata?.full_name?.split(' ').slice(1).join(' ') || '';
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: email || '',
            first_name: firstName || null,
            last_name: lastName || null,
            role: 'admin',
            is_owner: false,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError || !newProfile) {
          // If creation fails, use fallback
          const fallback = { id: userId, email: email || '', role: 'staff', is_owner: false };
          setUserProfile(fallback);
          return fallback;
        }
        
        setUserProfile(newProfile);
        return newProfile;
      }
      setUserProfile(data);
      return data;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        await fetchAndSetProfile(
          initialSession.user.id, 
          initialSession.user.email,
          initialSession.user.user_metadata
        );
      }
      setLoading(false);
      isInitialized.current = true;
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // ✅ Wipe cache on every login/logout event
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        purgeAllData();
      }

      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        // Pass user metadata for OAuth users to extract name information
        await fetchAndSetProfile(
          currentSession.user.id, 
          currentSession.user.email,
          currentSession.user.user_metadata
        );
      } else {
        setSession(null);
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // --- AUTH METHODS (Restored for your AuthPage.tsx) ---

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });

      if (error) return { error };

      // Create the profile entry immediately
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'admin',
          updated_at: new Date().toISOString(),
        });
      }
      return { data, error: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    purgeAllData();
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth?mode=login`,
        },
      });
      return { error };
    } catch (err) {
      return { error: err as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    setLoading(false);
    return result;
  };

  // ✅ CRITICAL: Ensure all methods are in the value object!
  const value = {
    user,
    session,
    userProfile,
    loading,
    authLoading: loading,
    emailVerified: !!user?.email_confirmed_at,
    signIn,
    signUp, // This fixes the "signUp is not a function" error
    signInWithGoogle,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};








// Helper functions for session tracking and event linking
function getSessionId(): string {
  // Get or create session ID from localStorage
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

async function linkAnonymousEventsToUser(userId: string, sessionId: string): Promise<{ linked: number }> {
  try {
    const { data, error } = await supabase
      .from('website_events')
      .update({ user_id: userId })
      .eq('session_id', sessionId)
      .is('user_id', null)
      .select();

    if (error) {
      console.error('Error linking anonymous events:', error);
      return { linked: 0 };
    }

    return { linked: data?.length || 0 };
  } catch (error) {
    console.error('Exception linking anonymous events:', error);
    return { linked: 0 };
  }
}