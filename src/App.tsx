
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

// Tipo para os papéis de usuário
type UserRole = "client" | "collaborator" | "admin";

// Interface para o usuário autenticado
interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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

/**
 * Provedor de Autenticação
 * 
 * Gerencia o estado de autenticação do usuário e fornece funções de login/logout
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há um token salvo ao carregar o aplicativo
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Em um app real, verificaria o token com o backend
          // Aqui estamos apenas simulando essa verificação
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
          console.error("Erro ao verificar token:", error);
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  /**
   * Função de login
   * @param email - Email do usuário
   * @param password - Senha do usuário
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulação de uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let role: UserRole = "client";
      let name = "Usuário Cliente";
      
      // Determinar o papel com base no email (apenas para simulação)
      if (email.includes("admin")) {
        role = "admin";
        name = "Admin User";
      } else if (email.includes("colab")) {
        role = "collaborator";
        name = "Colaborador";
      }
      
      const mockUser = {
        id: 1,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
      };
      
      // Em um app real, aqui você receberia um JWT do backend
      const mockToken = "mock-jwt-token";
      localStorage.setItem('authToken', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função de logout
   */
  const logout = () => {
    // Em um app real, aqui você poderia fazer uma chamada para invalidar o token no servidor
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
 * Componente de tela de carregamento
 */
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
    <p className="text-lg font-medium">Carregando...</p>
  </div>
);

/**
 * Componente para proteger rotas baseado no papel do usuário
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

  // Exibe tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verifica se o usuário tem permissão para acessar a rota
  if (user && !allowedRoles.includes(user.role)) {
    // Redireciona para dashboard por padrão se o usuário não tem permissão
    return <Navigate to="/dashboard" replace />;
  }

  // Permite acesso se passar por todas as verificações
  return <>{element}</>;
};

/**
 * Componente principal da aplicação
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota de login - acessível para todos */}
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
              
              {/* Página inicial redireciona para dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Página 404 para rotas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
