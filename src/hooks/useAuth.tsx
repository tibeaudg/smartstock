import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client'; // getypeerd met Database
import type { User, AuthError, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// UserProfile type from database schema
export type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<
    UserProfile | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Gebruik maybeSingle() in plaats van single() om 0 rijen te accepteren

      if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
      }
      
      // Als er geen profiel bestaat, maak een basis profiel object
      if (!data) {
        console.log('No profile found for user, creating basic profile object');
        return {
          id: userId,
          email: '',
          first_name: null,
          last_name: null,
          role: 'staff' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          selected_plan: null,
          blocked: false,
          last_login: null,
          is_owner: false,
          onboarding_completed: false,
          onboarding_data: null
        };
      }
      
      return data as UserProfile;
    } catch (err) {
      console.error('Unexpected error fetching user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const cancelled = { current: false };
    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error.message);
          if (!cancelled.current) setLoading(false);
          return;
        }

        if (currentSession && !cancelled.current) {
          setSession(currentSession);
          setUser(currentSession.user);

          const profile = await fetchUserProfile(currentSession.user.id);
          if (!cancelled.current) setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (!cancelled.current) setLoading(false);
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (cancelled.current) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Update last_login for any sign-in event
          if (event === 'SIGNED_IN') {
            try {
              await supabase.from('profiles').update({ 
                last_login: new Date().toISOString() 
              }).eq('id', newSession.user.id);
            } catch (error) {
              console.error('Error updating last_login:', error);
            }
          }
          
          const profile = await fetchUserProfile(newSession.user.id);
          
          // If no profile exists and this is a sign-in event, create one
          if (!profile && event === 'SIGNED_IN' && newSession.user) {
            try {
              // Extract name from user metadata (Google provides this)
              const firstName = newSession.user.user_metadata?.full_name?.split(' ')[0] || 
                               newSession.user.user_metadata?.given_name || 
                               newSession.user.user_metadata?.name?.split(' ')[0] || '';
              const lastName = newSession.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 
                              newSession.user.user_metadata?.family_name || 
                              newSession.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '';

              // Create profile for Google user
              const { error: profileError } = await supabase.from('profiles').upsert({
                id: newSession.user.id,
                email: newSession.user.email || '',
                first_name: firstName,
                last_name: lastName,
                role: 'admin',
                is_owner: false,
                updated_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
              }, { onConflict: 'id' });

              if (profileError) {
                console.error('Error creating profile for Google user:', profileError);
              } else {
                // Fetch the newly created profile
                const newProfile = await fetchUserProfile(newSession.user.id);
                if (!cancelled.current) setUserProfile(newProfile);
              }
            } catch (error) {
              console.error('Error handling Google sign-in profile creation:', error);
            }
          } else {
            if (!cancelled.current) setUserProfile(profile);
          }
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      cancelled.current = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    // Realtime subscription op eigen profiel
    const channel = supabase.channel('profile-blocked-check')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setUserProfile((prev) => {
            if (!prev) return prev;
            const prevBlocked = prev.blocked;
            const newBlocked = payload.new?.blocked;
            if (typeof prevBlocked !== 'undefined') {
              if (prevBlocked && !newBlocked) {
                // Deblokkeren: direct naar dashboard
                window.location.replace('/dashboard');
              } else if (prevBlocked !== newBlocked) {
                // Blokkeren: forceer reload
                window.location.reload();
              }
            }
            return { ...prev, ...payload.new } as UserProfile;
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Alleen afhankelijk van user.id, niet van het hele user object

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        // Update last_login in profiles
        await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
      }
      return { error };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'admin' | 'staff' = 'admin'
  ) => {
    setLoading(true);
    try {
      if (!firstName || !lastName) {
        return { error: new Error('Voornaam en achternaam zijn verplicht voor registratie.') };
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/settings`,
        },
      });

      if (signUpError) return { error: signUpError };

      const userId = data?.user?.id;
      if (!userId) {
        return { error: new Error('Geen user ID gevonden na registratie') };
      }

      // Profiel aanmaken in de 'profiles' tabel
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        is_owner: false, // Nieuwe gebruikers zijn standaard GEEN eigenaar
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' }); // Zorgt dat upsert op basis van primary key 'id' werkt
      

      if (profileError) {
        console.error('Fout bij aanmaken profiel:', profileError.message);
        return { error: profileError };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Exception tijdens registratie:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error('Google sign-in error:', error.message);
        return { error };
      }

      // If successful, the user will be redirected to Google
      // and then back to our app with the session
      return { error: null };
    } catch (error: any) {
      console.error('Exception during Google sign-in:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard`,
      });
      return { error };
    } catch (error: any) {
      console.error('Exception during password reset:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        setUser(null);
        setSession(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Exception during sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
