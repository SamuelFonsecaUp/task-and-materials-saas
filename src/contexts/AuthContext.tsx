
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

// Type for user roles
export type UserRole = "client" | "collaborator" | "admin";

// Interface for authenticated user - now using real Supabase user
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Interface for authentication context
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

// Creating authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Hook for using authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication Provider
 * 
 * Manages user authentication state with real Supabase authentication
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  console.log('AuthProvider rendered - Current state:', { user: user?.email, isAuthenticated, isLoading });

  // Get user profile from public.users table
  const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched:', data);
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar: data.avatar_url,
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  // Handle auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          const userProfile = await getUserProfile(session.user.id);
          if (userProfile && mounted) {
            console.log('Setting user and authenticated state');
            setUser(userProfile);
            setIsAuthenticated(true);
          } else if (mounted) {
            console.log('Failed to fetch user profile');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (mounted) {
          console.log('No session, clearing user state');
          setUser(null);
          setIsAuthenticated(false);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      if (session?.user && mounted) {
        getUserProfile(session.user.id).then((userProfile) => {
          if (userProfile && mounted) {
            console.log('Initial user profile set');
            setUser(userProfile);
            setIsAuthenticated(true);
          }
          if (mounted) {
            setIsLoading(false);
          }
        });
      } else if (mounted) {
        console.log('No initial session found');
        setIsLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        throw error;
      }

      console.log('Login successful:', data.user?.id);
      // The auth state change will handle setting the user
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Signup function
   */
  const signup = async (email: string, password: string, name: string, role: UserRole = "client") => {
    console.log('Signup attempt for:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        throw error;
      }

      console.log('Signup successful:', data.user?.id);
      setIsLoading(false);
      // The trigger will handle creating the user profile
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    console.log('Logout attempt');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
    console.log('Logout successful');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      signup,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
