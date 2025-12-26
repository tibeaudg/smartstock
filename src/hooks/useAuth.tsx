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
import { useSessionRevalidation } from './useSessionRevalidation';
import { useTabSyncSession } from './useTabSyncSession';
import { captureReferralInfo } from '@/utils/referralTracking';
import { linkAnonymousEventsToUser, getSessionId } from '@/utils/eventLinking';

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<
    UserProfile | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Session revalidation on tab visibility change
  useSessionRevalidation(async (isValid) => {
    if (!isValid && user) {
      console.log('[AuthProvider] Session possibly invalid, attempting silent refresh...');
      // First check current session
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Attempt a silent refresh before altering UI/auth state
        try {
          const { data: refreshed, error } = await supabase.auth.refreshSession();
          if (refreshed?.session && !error) {
            setSession(refreshed.session);
            setUser(refreshed.session.user);
            const profile = await fetchUserProfile(refreshed.session.user.id, refreshed.session.user.email);
            setUserProfile(profile);
            console.log('[AuthProvider] Silent session refresh succeeded');
          } else {
            console.warn('[AuthProvider] Silent session refresh failed; preserving previous auth state');
            // Preserve current auth state to avoid forcing logout; onAuthStateChange will handle real sign-outs
          }
        } catch (e) {
          console.warn('[AuthProvider] Silent session refresh threw; preserving previous auth state', e);
        }
      }
    }
  });

  // Tab sync for session state across tabs
  useTabSyncSession(user?.id || null, async () => {
    console.log('[AuthProvider] Session update from another tab, refreshing...');
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
      const profile = await fetchUserProfile(data.session.user.id, data.session.user.email);
      setUserProfile(profile);
    }
  });

  // Fetch user profile from database
  const fetchUserProfile = async (
    userId: string,
    userEmail?: string | null
  ): Promise<UserProfile | null> => {
    try {
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000); // Reduced from 8000 to 5000ms
      });
      
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Gebruik maybeSingle() in plaats van single() om 0 rijen te accepteren
      
      const result = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (result.error) {
        console.error('Error fetching user profile:', result.error.message);
        // Return basic profile object as fallback instead of null
        return {
          id: userId,
          email: userEmail || '',
          first_name: null,
          last_name: null,
          role: 'staff' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          selected_plan: null,
          blocked: false,
          last_login: null,
          is_owner: false,
        };
      }
      
      // Als er geen profiel bestaat, maak een basis profiel object
      if (!result.data) {
        console.log('No profile found for user, creating basic profile object');
        return {
          id: userId,
          email: userEmail || '',
          first_name: null,
          last_name: null,
          role: 'staff' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          selected_plan: null,
          blocked: false,
          last_login: null,
          is_owner: false,
        };
      }
      
      // Use auth user's email as fallback if profile email is empty
      const profile = result.data as UserProfile;
      if (!profile.email && userEmail) {
        profile.email = userEmail;
      }
      
      return profile;
    } catch (err) {
      console.error('Unexpected error fetching user profile:', err);
      // Return basic profile object as fallback
      return {
        id: userId,
        email: userEmail || '',
        first_name: null,
        last_name: null,
        role: 'staff' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        selected_plan: null,
        blocked: false,
        last_login: null,
        is_owner: false,
      };
    }
  };

  useEffect(() => {
    const cancelled = { current: false };
    // Track previous user email verification status for detection
    let previousEmailVerified: boolean | null = null;

    // Check if there are auth tokens in the URL hash (from email verification, OAuth, etc.)
    const hasAuthTokensInHash = typeof window !== 'undefined' && 
      window.location.hash.includes('access_token') && 
      window.location.hash.includes('type=');

    // Flags to track hash token processing state (use refs so they're accessible in callbacks)
    const waitingForHashTokens = { current: hasAuthTokensInHash };
    const hashTokenProcessed = { current: false };

    if (hasAuthTokensInHash) {
      console.log('[AuthProvider] Detected auth tokens in URL hash, will wait for processing...');
    }

    const initializeAuth = async () => {
      // If hash tokens are present, manually parse and set session if Supabase doesn't auto-process
      if (hasAuthTokensInHash && typeof window !== 'undefined') {
        try {
          const hash = window.location.hash.substring(1); // Remove #
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          if (accessToken && type === 'signup') {
            console.log('[AuthProvider] Manually processing email verification tokens from hash...');
            // Set the session manually
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (sessionData?.session && !sessionError) {
              console.log('[AuthProvider] Successfully set session from hash tokens');
              setSession(sessionData.session);
              setUser(sessionData.session.user);
              hashTokenProcessed.current = true;
              waitingForHashTokens.current = false;
              
              // Initialize previous email verification status
              previousEmailVerified = !!sessionData.session.user.email_confirmed_at;

              // Fetch profile
              try {
                const profile = await fetchUserProfile(sessionData.session.user.id, sessionData.session.user.email);
                if (!cancelled.current) setUserProfile(profile);
              } catch (profileError) {
                console.error('Error fetching profile:', profileError);
                // Set basic profile
                if (!cancelled.current) {
                  setUserProfile({
                    id: sessionData.session.user.id,
                    email: sessionData.session.user.email || '',
                    first_name: null,
                    last_name: null,
                    role: 'staff' as const,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    selected_plan: null,
                    blocked: false,
                    last_login: null,
                    is_owner: false,
                  });
                }
              }

              // Clear hash
              const newUrl = window.location.pathname + window.location.search;
              window.history.replaceState({}, '', newUrl);
              console.log('[AuthProvider] Cleared hash tokens after manual processing');
              
              if (!cancelled.current) setLoading(false);
              return;
            } else if (sessionError) {
              console.error('[AuthProvider] Error setting session from hash tokens:', sessionError);
            }
          }
        } catch (hashError) {
          console.error('[AuthProvider] Error processing hash tokens:', hashError);
        }
      }

      // If hash tokens are present, give Supabase time to process them before checking session
      if (hasAuthTokensInHash && !hashTokenProcessed.current) {
        // Wait for Supabase to process hash tokens through detectSessionInUrl
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Safety timeout: force loading to false after 10 seconds to prevent indefinite blocking
      // Longer timeout if hash tokens are present
      const safetyTimeoutMs = hasAuthTokensInHash ? 12000 : 8000;
      const safetyTimeout = setTimeout(() => {
        if (!cancelled.current) {
          console.warn('[AuthProvider] Auth initialization timeout - forcing loading to false');
          setLoading(false);
        }
      }, safetyTimeoutMs);

      let sessionTimeoutId: ReturnType<typeof setTimeout> | null = null;

      try {
        // Add timeout to session fetch
        const sessionTimeoutPromise = new Promise((_, reject) => {
          sessionTimeoutId = setTimeout(
            () => reject(new Error('Session fetch timeout')),
            hasAuthTokensInHash ? 15000 : 25000
          );
        });

        const sessionPromise = supabase.auth.getSession();
        
        const result = await Promise.race([sessionPromise, sessionTimeoutPromise]) as any;

        if (result?.error) {
          console.error('Error getting session:', result.error.message);
          // If it's a timeout or transient network error, keep loading to avoid false logout
          const msg = String(result.error?.message || '').toLowerCase();
          const isTimeout = msg.includes('timeout') || msg.includes('network');
          if (!cancelled.current) {
            if (!hasAuthTokensInHash && !isTimeout) {
              setLoading(false);
            }
          }
          clearTimeout(safetyTimeout);
          return;
        }

        const { data: { session: currentSession } } = result || { data: { session: null } };

        if (currentSession && !cancelled.current) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Initialize previous email verification status
          previousEmailVerified = !!currentSession.user.email_confirmed_at;

          // Mark hash tokens as processed if we got a session
          if (hasAuthTokensInHash) {
            hashTokenProcessed.current = true;
            waitingForHashTokens.current = false;
          }

          // Fetch profile with timeout protection
          try {
            const profile = await fetchUserProfile(currentSession.user.id, currentSession.user.email);
            if (!cancelled.current) setUserProfile(profile);
          } catch (profileError) {
            console.error('Error fetching profile during init:', profileError);
            // Continue without blocking - profile can be fetched later
            if (!cancelled.current) {
              // Set a basic profile to prevent blocking
              setUserProfile({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                first_name: null,
                last_name: null,
                role: 'staff' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                selected_plan: null,
                blocked: false,
                last_login: null,
                is_owner: false,
              });
            }
          }

          // If we processed hash tokens and have a session, clear the hash
          if (hasAuthTokensInHash && typeof window !== 'undefined') {
            const newUrl = window.location.pathname + window.location.search;
            window.history.replaceState({}, '', newUrl);
            console.log('[AuthProvider] Cleared auth tokens from URL hash after successful processing');
          }
        } else {
          // No session initially
          previousEmailVerified = null;
          
          // If we have hash tokens but no session yet, keep waiting for auth state change
          if (hasAuthTokensInHash && !hashTokenProcessed.current) {
            console.log('[AuthProvider] Hash tokens detected but no session yet, waiting for auth state change...');
            // Don't set loading to false yet - wait for onAuthStateChange
            clearTimeout(safetyTimeout);
            return;
          }
        }
      } catch (error: any) {
        console.error('Error during auth initialization:', error);
        const msg = String(error?.message || '').toLowerCase();
        const isTimeout = msg.includes('timeout') || msg.includes('network');
        // If we have hash tokens, keep waiting for auth state change
        if (!hasAuthTokensInHash || hashTokenProcessed.current) {
          if (!cancelled.current && !isTimeout) setLoading(false);
          // For timeouts, keep loading; ProtectedRoute will show a timed fallback UI
        }
      } finally {
        if (sessionTimeoutId) {
          clearTimeout(sessionTimeoutId);
        }
        clearTimeout(safetyTimeout);
        // Only set loading to false if we're not waiting for hash tokens
        if (!waitingForHashTokens.current && !cancelled.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (cancelled.current) return;

        console.log('[AuthProvider] Auth state change:', event, newSession?.user?.id);

        // Check if this is an email verification completion
        const currentEmailVerified = newSession?.user?.email_confirmed_at ? true : false;
        const isEmailVerification = previousEmailVerified === false && 
          currentEmailVerified === true &&
          (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED');

        if (isEmailVerification) {
          console.log('[AuthProvider] Email verification completed!');
        }

        // Update previous state for next check
        previousEmailVerified = currentEmailVerified;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Update last_login and link events for any sign-in event
          if (event === 'SIGNED_IN') {
            try {
              // Update last_login
              const updateData: Database['public']['Tables']['profiles']['Update'] = { 
                last_login: new Date().toISOString() 
              };
              const { error: updateError } = await supabase.from('profiles').update(updateData).eq('id', newSession.user.id);
              if (updateError) {
                console.error('Error updating last_login:', updateError);
              }

              // Link anonymous events to user based on session ID
              const sessionId = getSessionId();
              const { linked } = await linkAnonymousEventsToUser(newSession.user.id, sessionId);
              console.log(`[Auth] Linked ${linked} anonymous events to user after login`);

              // Track login event
              try {
                const loginEvent = {
                  event_type: 'login',
                  page_url: typeof window !== 'undefined' ? window.location.href : '',
                  user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                  referrer: typeof document !== 'undefined' ? document.referrer : '',
                  session_id: sessionId,
                  user_id: newSession.user.id,
                  metadata: {
                    timestamp: Date.now(),
                    login_method: 'email', // or 'google' if from OAuth
                    linked_events: linked
                  }
                };
                
                const { error: loginTrackError } = await supabase.from('website_events').insert([loginEvent]);
                if (loginTrackError) {
                  console.error('Error tracking login event:', loginTrackError);
                } else {
                  console.log('[Auth] Login event tracked');
                }
              } catch (trackError) {
                console.error('Exception tracking login event:', trackError);
              }
            } catch (error) {
              console.error('Error updating last_login:', error);
            }
          }
          
          // Fetch profile BEFORE clearing loading state to ensure AuthRoute has all data
          let profile = await fetchUserProfile(newSession.user.id, newSession.user.email);
          
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

              // Capture referral information for Google sign-in
              const referralSource = captureReferralInfo();

              // Create profile for Google user
              const profileData: Database['public']['Tables']['profiles']['Insert'] = {
                id: newSession.user.id,
                email: newSession.user.email || '',
                first_name: firstName,
                last_name: lastName,
                role: 'admin',
                is_owner: false,
                updated_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                referral_source: referralSource, // Store referral information
              };
              const { error: profileError } = await supabase.from('profiles').upsert(profileData, { 
                onConflict: 'id',
                ignoreDuplicates: false 
              });

              if (profileError) {
                console.error('Error creating profile for Google user:', profileError);
              } else {
                // Link anonymous events to user
                const sessionId = getSessionId();
                const { linked } = await linkAnonymousEventsToUser(newSession.user.id, sessionId);
                console.log(`[Auth] Linked ${linked} anonymous events to Google user after sign-in`);

                // Track login event for Google sign-in
                try {
                  const loginEvent = {
                    event_type: 'login',
                    page_url: typeof window !== 'undefined' ? window.location.href : '',
                    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    referrer: typeof document !== 'undefined' ? document.referrer : '',
                    session_id: sessionId,
                    user_id: newSession.user.id,
                    metadata: {
                      timestamp: Date.now(),
                      login_method: 'google',
                      linked_events: linked
                    }
                  };
                  
                  const { error: loginTrackError } = await supabase.from('website_events').insert([loginEvent]);
                  if (loginTrackError) {
                    console.error('Error tracking Google login event:', loginTrackError);
                  } else {
                    console.log('[Auth] Google login event tracked');
                  }
                } catch (trackError) {
                  console.error('Exception tracking Google login event:', trackError);
                }

                // Fetch the newly created profile
                const newProfile = await fetchUserProfile(newSession.user.id, newSession.user.email);
                if (!cancelled.current) setUserProfile(newProfile);
              }
            } catch (error) {
              console.error('Error handling Google sign-in profile creation:', error);
            }
          } else {
            if (!cancelled.current) setUserProfile(profile);
          }

          // Clear loading state AFTER profile is fetched (for SIGNED_IN events)
          // This ensures AuthRoute has both user and userProfile when it checks
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession && !cancelled.current) {
            // If this is from hash tokens, mark as processed and clear loading
            if (hasAuthTokensInHash && !hashTokenProcessed.current) {
              hashTokenProcessed.current = true;
              waitingForHashTokens.current = false;
              console.log('[AuthProvider] Hash tokens processed via', event, 'event');
            }
            
            setLoading(false);
            
            // Clear the hash after successful sign-in from URL tokens (email verification, OAuth)
            if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
              const newUrl = window.location.pathname + window.location.search;
              window.history.replaceState({}, '', newUrl);
              console.log('[AuthProvider] Cleared auth tokens from URL hash after', event, 'event');
            }
          }
        } else {
          setUserProfile(null);
          // If no session, clear loading
          if (event === 'SIGNED_OUT' && !cancelled.current) {
            setLoading(false);
          }
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
            return { ...prev, ...(payload.new as Partial<UserProfile>) } as UserProfile;
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
        const updateData: Database['public']['Tables']['profiles']['Update'] = { 
          last_login: new Date().toISOString() 
        };
        const { error: updateError } = await supabase.from('profiles').update(updateData).eq('id', data.user.id);
        if (updateError) {
          console.error('Error updating last_login:', updateError);
        }
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
          // Allow user to access dashboard immediately without email confirmation
          // emailRedirectTo is still set for when they do verify their email
          emailRedirectTo: `${window.location.origin}/dashboard/settings`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      // After signup, user should be able to access dashboard immediately
      // Supabase should allow unconfirmed users to sign in (this needs to be configured in Supabase dashboard)

      if (signUpError) return { error: signUpError };

      const userId = data?.user?.id;
      if (!userId) {
        return { error: new Error('Geen user ID gevonden na registratie') };
      }

      // Capture referral information at signup
      const referralSource = captureReferralInfo();

      // Profiel aanmaken in de 'profiles' tabel
      const profileData: Database['public']['Tables']['profiles']['Insert'] = {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        is_owner: false, // Nieuwe gebruikers zijn standaard GEEN eigenaar
        updated_at: new Date().toISOString(),
        onboarding: null, // New signups start with onboarding not completed
        referral_source: referralSource, // Store referral information
      };
      const { error: profileError } = await supabase.from('profiles').upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      }); // Zorgt dat upsert op basis van primary key 'id' werkt
      

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

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      return { error: new Error('No user email available') as AuthError };
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      return { error };
    } catch (error: any) {
      console.error('Exception during resend verification email:', error);
      return { error };
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

  // Compute email verification status
  // In Supabase, email is verified if email_confirmed_at is not null
  const emailVerified = user ? !!user.email_confirmed_at : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        loading,
        authLoading: loading, // Alias for clarity
        emailVerified,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        resendVerificationEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
