import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { User, AuthError, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authLoading: boolean; 
  emailVerified: boolean;
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isInitialized = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const purge = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
    queryClient.invalidateQueries({ queryKey: ['branches'] })
  }, [queryClient]);

  const fetchProfile = useCallback(async (userId: string, metadata?: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          role: 'admin',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      setUserProfile(newProfile);
    } else {
      setUserProfile(data);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      if (initSession) {
        userIdRef.current = initSession.user.id;
        setSession(initSession);
        setUser(initSession.user);
        fetchProfile(initSession.user.id, initSession.user.user_metadata);
      }
      isInitialized.current = true;
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      const newUserId = currentSession?.user?.id ?? null;
      const oldUserId = userIdRef.current;

      // Prevent redundant re-renders on token refresh
      if (newUserId === oldUserId && isInitialized.current && event !== 'SIGNED_OUT') return;

      if (event === 'SIGNED_OUT') {
        purge();
        setUser(null);
        setSession(null);
        setUserProfile(null);
      } else {
        if (oldUserId && newUserId !== oldUserId) purge();
        setUser(currentSession?.user ?? null);
        setSession(currentSession);
        if (newUserId) fetchProfile(newUserId, currentSession?.user.user_metadata);

        // Trigger welcome lifecycle email for new users (account < 24h), dedup enforced server-side
        if (event === 'SIGNED_IN' && currentSession?.user) {
          const createdAt = new Date(currentSession.user.created_at);
          const isNewUser = (Date.now() - createdAt.getTime()) < 24 * 60 * 60 * 1000;
          if (isNewUser) {
            supabase.functions.invoke('trigger-lifecycle-emails', {
              body: { stage: 'welcome', selfTrigger: true },
            }).catch(err => console.warn('[auth] welcome email trigger failed:', err));
          }
        }
      }

      userIdRef.current = newUserId;
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, purge]);

  const methods = useMemo(() => ({
    signIn: async (email: string, pass: string) => 
      supabase.auth.signInWithPassword({ email, password: pass }),
    
    signOut: async () => { 
      purge(); 
      await supabase.auth.signOut(); 
    },
    
    signInWithGoogle: async () => 
      supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { redirectTo: `${window.location.origin}/auth` } 
      }),
    
    resetPassword: async (email: string) => 
      supabase.auth.resetPasswordForEmail(email),
    
    resendVerificationEmail: async () => {
      if (!user?.email) return { error: { message: 'No email found' } as AuthError };
      return supabase.auth.resend({ type: 'signup', email: user.email });
    },

    signUp: async (email: string, pass: string, fn: string, ln: string, role: 'admin' | 'staff' = 'admin') => {
      const res = await supabase.auth.signUp({ 
        email, 
        password: pass, 
        options: { data: { first_name: fn, last_name: ln } } 
      });
      if (res.data.user) {
        await supabase.from('profiles').upsert({ 
          id: res.data.user.id, 
          email, 
          first_name: fn, 
          last_name: ln, 
          role: role 
        });
      }
      return { error: res.error };
    }
  }), [purge, user?.email]);

  const value = useMemo(() => ({
    user,
    session,
    userProfile,
    loading,
    authLoading: loading,
    emailVerified: !!user?.email_confirmed_at,
    ...methods
  }), [user, session, userProfile, loading, methods]);

  return (
    <AuthContext.Provider value={value}>
      {/* Ensure children only hide on the absolute first mount 
          to prevent the "Function not implemented" error during hydration/routing.
      */}
      {!isInitialized.current && loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};