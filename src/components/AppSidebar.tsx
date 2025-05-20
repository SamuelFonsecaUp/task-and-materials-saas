import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Settings, 
  Folder, 
  User, 
  CheckCheck, 
  BookOpen,
  ClipboardList,
  Users,
  LayoutDashboard,
  UserCog
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // Verificar se o usuário possui um determinado papel
  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  // Itens de navegação comum a todos os usuários
  const commonNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["client", "collaborator", "admin"]
    }
  ];

  // Itens de navegação para colaboradores e admins
  const staffNavItems = [
    {
      title: "Tarefas",
      url: "/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["collaborator", "admin"]
    },
    {
      title: "Projetos",
      url: "/projects",
      icon: <Folder className="h-5 w-5" />,
      roles: ["collaborator", "admin"]
    },
    {
      title: "Materiais",
      url: "/materials",
      icon: <CheckCheck className="h-5 w-5" />,
      roles: ["collaborator", "admin"]
    },
    {
      title: "CRM Prospectos",
      url: "/crm-prospects",
      icon: <User className="h-5 w-5" />,
      roles: ["collaborator", "admin"]
    },
    {
      title: "Calendário",
      url: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["collaborator", "admin"]
    }
  ];

  // Itens de navegação apenas para admins
  const adminNavItems = [
    {
      title: "Clientes",
      url: "/clients",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"]
    }
  ];

  // Itens de configuração
  const configItems = [
    {
      title: "Meu Perfil",
      url: "/profile",
      icon: <UserCog className="h-5 w-5" />,
      roles: ["client", "collaborator", "admin"]
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["collaborator", "admin"]
    }
  ];

  // Combinar todos os itens de navegação
  const navigationItems = [
    ...commonNavItems,
    ...staffNavItems.filter(item => hasRole(item.roles)),
    ...adminNavItems.filter(item => hasRole(item.roles))
  ];

  // Filtrar itens de configuração
  const filteredConfigItems = configItems.filter(item => hasRole(item.roles));

  // Verificar se a rota atual está ativa
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!collapsed && (
              <span className="text-lg font-semibold text-agency-primary">Agency App</span>
            )}
          </div>
          <SidebarTrigger />
        </div>
        
        <SidebarContent>
          {/* Grupo principal de navegação */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={isActive(item.url) ? "nav-link nav-link-active" : "nav-link nav-link-inactive"}
                    >
                      <Link to={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Grupo de configurações */}
          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredConfigItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={isActive(item.url) ? "nav-link nav-link-active" : "nav-link nav-link-inactive"}
                    >
                      <Link to={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        {/* Perfil do usuário */}
        <div className="mt-auto p-4 border-t cursor-pointer" onClick={() => window.location.href = '/profile'}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={user?.avatar || "https://i.pravatar.cc/150?img=68"} 
                alt={user?.name || "Usuário"} 
                className="w-full h-full object-cover" 
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name || "Usuário"}</span>
                <span className="text-xs text-gray-500">
                  {user?.role === "admin" ? "Administrador" : 
                   user?.role === "collaborator" ? "Colaborador" : "Cliente"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
