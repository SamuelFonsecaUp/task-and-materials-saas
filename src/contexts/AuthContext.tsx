
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType, UserRole } from "./auth/types";
import { useAuthState } from "./auth/useAuthState";
import { AuthActions } from "./auth/authActions";

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
  const { user, isAuthenticated, isLoading } = useAuthState();

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login: AuthActions.login, 
      signup: AuthActions.signup,
      logout: AuthActions.logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export types for backward compatibility
export type { UserRole, AuthUser } from "./auth/types";
