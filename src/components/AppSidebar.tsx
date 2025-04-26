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
  Users
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

const AppSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Sample user data - in a real app would come from authentication context
  const user = {
    name: "Admin User",
    email: "admin@agency.com",
    role: "admin", // or "client"
    profileImage: "https://i.pravatar.cc/150?img=68",
  };

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Projetos",
      url: "/projects",
      icon: <Folder className="h-5 w-5" />,
    },
    {
      title: "Tarefas",
      url: "/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Materiais",
      url: "/materials",
      icon: <CheckCheck className="h-5 w-5" />,
    },
    {
      title: "Calendário",
      url: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: <Settings className="h-5 w-5" />,
    }
  ];

  // Admin-only navigation items
  const adminItems = [
    {
      title: "Clientes",
      url: "/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: <Settings className="h-5 w-5" />,
    }
  ];

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
        </SidebarContent>
        
        <div className="mt-auto p-4 border-t cursor-pointer" onClick={() => window.location.href = '/profile'}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.name}</span>
                <span className="text-xs text-gray-500">{user.role === "admin" ? "Administrador" : "Cliente"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
