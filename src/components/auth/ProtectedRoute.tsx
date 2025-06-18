
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  element, 
  allowedRoles, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has permission to access route
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
