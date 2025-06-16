import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          first_name: user?.user_metadata?.first_name || null,
          last_name: user?.user_metadata?.last_name || null,
          role: 'staff',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
        return defaultProfile;
      }

      if (!profileData) {
        console.log('No profile found for user, creating default profile...');
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          first_name: user?.user_metadata?.first_name || null,
          last_name: user?.user_metadata?.last_name || null,
          role: 'staff',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
        return defaultProfile;
      }

      console.log('Profile data received:', profileData);
      const profile: UserProfile = {
        ...profileData,
        role: profileData.role || 'staff'
      };
      
      setProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error in profile fetch:', error);
      const fallbackProfile: UserProfile = {
        id: userId,
        email: user?.email || '',
        first_name: user?.user_metadata?.first_name || null,
        last_name: user?.user_metadata?.last_name || null,
        role: 'staff',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    let mounted = true;
    let initialized = false;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        // Prevent duplicate processing
        if (initialized && event === 'INITIAL_SESSION') return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        if (!initialized) {
          initialized = true;
        }
        
        setLoading(false);
      }
    );

    // Check for existing session only once
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        console.log('Initial session check:', session?.user?.email);
        
        if (!mounted) return;
        
        // Only process if we haven't been initialized by the listener
        if (!initialized && session) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          initialized = true;
        }
        
        if (mounted) setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'staff' = 'staff') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        }
      }
    });
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { data, error };
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
