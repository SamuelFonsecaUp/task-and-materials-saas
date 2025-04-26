
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { createContext, useContext, useState } from "react";

const queryClient = new QueryClient();

// Tipo para os papéis de usuário
type UserRole = "client" | "collaborator" | "admin";

// Interface para o contexto de autenticação
interface AuthContextType {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | null>(null);

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Componente para proteger rotas baseado no papel do usuário
const ProtectedRoute = ({ 
  element, 
  allowedRoles, 
  redirectTo = "/login" 
}: { 
  element: React.ReactNode; 
  allowedRoles: UserRole[]; 
  redirectTo?: string;
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redireciona para dashboard por padrão se o usuário não tem permissão
    return <Navigate to="/dashboard" replace />;
  }

  return <>{element}</>;
};

const App = () => {
  // Mock de usuário autenticado - em um app real, isso viria de uma API ou contexto de autenticação
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=68"
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Funções mock de login e logout
  const login = async (email: string, password: string) => {
    // Simular uma chamada de API
    console.log("Login com:", email, password);
    setIsAuthenticated(true);
    // Em um app real, aqui seria feita a autenticação com backend
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Valor do contexto de autenticação
  const authContextValue: AuthContextType = {
    user: isAuthenticated ? currentUser : null,
    isAuthenticated,
    login,
    logout
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas por papel */}
              
              {/* Dashboard - Acessível para todos os papéis */}
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
              
              {/* Tarefas - Acessível para colaboradores e admins */}
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
              
              {/* Projetos - Acessível para colaboradores e admins */}
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
              
              {/* Materiais - Acessível para colaboradores e admins */}
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
              
              {/* Clientes - Acessível apenas para admins */}
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
              
              {/* CRM de Prospectos - Acessível para colaboradores e admins */}
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
              
              {/* Perfil - Acessível para todos os papéis */}
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
              
              {/* Configurações - Acessível para colaboradores e admins */}
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
              
              {/* Calendário - Acessível para colaboradores e admins */}
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute 
                    element={
                      <MainLayout>
                        <NotFound />
                      </MainLayout>
                    } 
                    allowedRoles={["collaborator", "admin"]} 
                  />
                } 
              />
              
              {/* Página inicial redireciona para dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Página 404 para rotas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
