
import { useState } from "react";
import { Bell, User, Settings } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopNavProps {
  toggleSidebar: () => void;
}

const TopNav = ({ toggleSidebar }: TopNavProps) => {
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "Novo material para aprovação",
      message: "Cliente XYZ adicionou um novo material para aprovação.",
      time: "20m atrás",
      isRead: false,
    },
    {
      id: 2,
      title: "Tarefa atribuída",
      message: "Você recebeu uma nova tarefa: 'Criar banner para campanha'.",
      time: "1h atrás",
      isRead: false,
    },
    {
      id: 3,
      title: "Material aprovado",
      message: "Cliente ABC aprovou o material 'Logo Redesign'.",
      time: "3h atrás",
      isRead: false,
    },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3 lg:space-x-8">
        <div className="text-2xl font-bold text-agency-primary">Agency App</div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-agency-primary text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {unreadNotifications > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={markNotificationsAsRead} 
                  className="text-xs text-agency-primary"
                >
                  Marcar tudo como lido
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {!notification.isRead && (
                        <Badge className="bg-agency-primary text-white text-xs">Nova</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 cursor-pointer">
              <div className="w-full text-center text-sm text-agency-primary">
                Ver todas as notificações
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=68" alt="User" className="h-full w-full object-cover" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;
