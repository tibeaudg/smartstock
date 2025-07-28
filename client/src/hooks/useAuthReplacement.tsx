import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import type { Profile } from '@shared/schema';
import { api } from '@/lib/api';

// Simple auth replacement that uses localStorage for demo purposes
// In a real application, you'd use proper JWT tokens and server-side authentication

export type UserProfile = Profile & { blocked?: boolean };

interface AuthContextType {
  user: any | null; // Mock user object
  session: any | null; // Mock session object
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: 'admin' | 'staff'
  ) => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
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
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const profile = await api.profiles.getById(userId);
      return profile as UserProfile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check localStorage for existing session
        const storedSession = localStorage.getItem('stockflow-session');
        const storedUser = localStorage.getItem('stockflow-user');
        
        if (storedSession && storedUser) {
          const sessionData = JSON.parse(storedSession);
          const userData = JSON.parse(storedUser);
          
          setSession(sessionData);
          setUser(userData);
          
          // Fetch current profile data
          const profile = await fetchUserProfile(userData.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        // Clear invalid data
        localStorage.removeItem('stockflow-session');
        localStorage.removeItem('stockflow-user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Mock authentication - in real app, you'd validate with backend
      // For demo, we'll use the admin profile from storage
      const profiles = await api.profiles.getAll();
      const profile = profiles.find(p => p.email === email);
      
      if (!profile) {
        return { error: { message: 'Invalid email or password' } };
      }

      // Create mock user and session
      const mockUser = {
        id: profile.id,
        email: profile.email,
        created_at: profile.created_at,
      };

      const mockSession = {
        access_token: 'mock-token',
        user: mockUser,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      // Store in localStorage
      localStorage.setItem('stockflow-session', JSON.stringify(mockSession));
      localStorage.setItem('stockflow-user', JSON.stringify(mockUser));

      setSession(mockSession);
      setUser(mockUser);
      setUserProfile(profile as UserProfile);

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'Failed to sign in' } };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'admin' | 'staff' = 'staff'
  ) => {
    try {
      // Create new profile
      const newProfile = await api.profiles.create({
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      });

      // Auto sign in after successful signup
      return await signIn(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: { message: 'Failed to create account' } };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Mock password reset - in real app, you'd send reset email
      console.log('Password reset requested for:', email);
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: { message: 'Failed to send password reset email' } };
    }
  };

  const signOut = async () => {
    try {
      // Clear localStorage and state
      localStorage.removeItem('stockflow-session');
      localStorage.removeItem('stockflow-user');
      
      setSession(null);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};