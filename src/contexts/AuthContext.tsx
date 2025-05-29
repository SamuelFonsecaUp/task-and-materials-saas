
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "client" | "collaborator" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const isAuthenticated = !!user && !!session;

  // Convert Supabase user to AuthUser
  const createAuthUser = (supabaseUser: User): AuthUser => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'client',
      avatar: supabaseUser.user_metadata?.avatar_url,
    };
  };

  // Auth actions
  const login = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = "client"): Promise<void> => {
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
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  // Auth state management
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (mounted) {
          setSession(session);
          if (session?.user) {
            setUser(createAuthUser(session.user));
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        setSession(session);
        
        if (session?.user) {
          setUser(createAuthUser(session.user));
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
