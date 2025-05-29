
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Type for user roles
export type UserRole = "client" | "collaborator" | "admin";

// Interface for authenticated user
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
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get user profile from public.users table
  const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          const userProfile = await getUserProfile(session.user.id);
          if (mounted && userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
            console.log('User authenticated, profile loaded:', userProfile);
          }
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session ? 'with session' : 'no session');
        
        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id);
          if (mounted && userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
            console.log('User profile loaded after auth change:', userProfile);
          }
        } else {
          if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
            console.log('User logged out');
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Login successful, waiting for auth state change...');
      // The auth state change handler will update the user state
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Signup function
   */
  const signup = async (email: string, password: string, name: string, role: UserRole = "client") => {
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
        throw error;
      }

      console.log('Signup successful');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
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
