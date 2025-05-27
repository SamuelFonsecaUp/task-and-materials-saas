
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Type for user roles
export type UserRole = "client" | "collaborator" | "admin";

// Interface for authenticated user - updated to match Supabase schema
export interface AuthUser {
  id: string; // Changed from number to string to match UUID
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
  logout: () => void;
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
 * Manages user authentication state and provides login/logout functions
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // In a real app, would verify token with backend
          // Here we're just simulating that verification
          const mockUser = {
            id: "550e8400-e29b-41d4-a716-446655440000", // Mock UUID
            name: "Admin User",
            email: "admin@example.com",
            role: "admin" as UserRole,
            avatar: "https://i.pravatar.cc/150?img=68"
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  /**
   * Login function
   * @param email - User email
   * @param password - User password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let role: UserRole = "client";
      let name = "Client User";
      let userId = "550e8400-e29b-41d4-a716-446655440001"; // Mock UUID for client
      
      // Determine role based on email (for simulation)
      if (email.includes("admin")) {
        role = "admin";
        name = "Admin User";
        userId = "550e8400-e29b-41d4-a716-446655440000"; // Mock UUID for admin
      } else if (email.includes("colab")) {
        role = "collaborator";
        name = "Collaborator";
        userId = "550e8400-e29b-41d4-a716-446655440002"; // Mock UUID for collaborator
      }
      
      const mockUser = {
        id: userId,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
      };
      
      // In a real app, you would receive a JWT from the backend
      const mockToken = "mock-jwt-token";
      localStorage.setItem('authToken', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    // In a real app, you might call to invalidate token on server
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
