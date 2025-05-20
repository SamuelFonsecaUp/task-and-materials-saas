
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Materials from "./pages/Materials";
import Clients from "./pages/Clients";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import CrmProspects from "./pages/CrmProspects";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Type for user roles
type UserRole = "client" | "collaborator" | "admin";

// Interface for authenticated user
interface AuthUser {
  id: number;
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
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
            id: 1,
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
      
      // Determine role based on email (for simulation)
      if (email.includes("admin")) {
        role = "admin";
        name = "Admin User";
      } else if (email.includes("colab")) {
        role = "collaborator";
        name = "Collaborator";
      }
      
      const mockUser = {
        id: 1,
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

/**
 * Loading screen component
 */
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
    <p className="text-lg font-medium">Loading...</p>
  </div>
);

/**
 * Component to protect routes based on user role
 */
const ProtectedRoute = ({ 
  element, 
  allowedRoles, 
  redirectTo = "/login" 
}: { 
  element: React.ReactNode; 
  allowedRoles: UserRole[]; 
  redirectTo?: string;
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has permission to access route
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard by default if user doesn't have permission
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access if passes all checks
  return <>{element}</>;
};

/**
 * Main application component
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Login route - accessible to all */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes by role */}
              
              {/* Dashboard - Accessible to all roles */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    } 
                    allowedRoles={["client", "collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Tasks - Accessible to collaborators and admins */}
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Tasks />
                      </MainLayout>
                    } 
                    allowedRoles={["collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Projects - Accessible to collaborators and admins */}
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Projects />
                      </MainLayout>
                    } 
                    allowedRoles={["collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Materials - Accessible to collaborators and admins */}
              <Route 
                path="/materials" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Materials />
                      </MainLayout>
                    } 
                    allowedRoles={["collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Clients - Accessible only to admins */}
              <Route 
                path="/clients" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Clients />
                      </MainLayout>
                    } 
                    allowedRoles={["admin"]} 
                  />
                } 
              />
              
              {/* CRM Prospects - Accessible to collaborators and admins */}
              <Route 
                path="/crm-prospects" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <CrmProspects />
                      </MainLayout>
                    } 
                    allowedRoles={["collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Profile - Accessible to all roles */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Profile />
                      </MainLayout>
                    } 
                    allowedRoles={["client", "collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Settings - Accessible to collaborators and admins */}
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <Settings />
                      </MainLayout>
                    } 
                    allowedRoles={["collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Home page redirects to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 page for routes not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
