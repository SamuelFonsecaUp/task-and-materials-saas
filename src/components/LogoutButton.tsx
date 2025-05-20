
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Componente de botão de logout
 * 
 * Exibe um botão que, quando clicado, mostra um diálogo de confirmação
 * e realiza o logout do usuário se confirmado.
 */
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  /**
   * Manipula o processo de logout
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Em um app real, aqui você chamaria uma API para invalidar o token
      // POST /api/auth/logout
      await logout();
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente sair?</AlertDialogTitle>
          <AlertDialogDescription>
            Você será desconectado do sistema e redirecionado para a página de login.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoggingOut ? "Saindo..." : "Sim, sair"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
