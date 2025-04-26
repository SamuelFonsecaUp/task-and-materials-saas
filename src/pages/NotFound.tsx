
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-agency-primary mb-2">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-6">Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="bg-agency-primary hover:bg-agency-secondary">
          <a href="/">Voltar para a página inicial</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
