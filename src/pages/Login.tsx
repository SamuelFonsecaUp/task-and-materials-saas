
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/App";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

/**
 * Componente de Login
 * 
 * Responsável por autenticar o usuário no sistema, validando as credenciais
 * e redirecionando para a página adequada de acordo com o papel do usuário.
 */
const Login = () => {
  // Estados para o formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});

  // Contexto de autenticação e navegação
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Valida os campos do formulário
   * @returns boolean - se o formulário é válido
   */
  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    let isValid = true;

    // Validar email
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    // Validar senha
    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Manipula o envio do formulário
   * @param e - Evento de formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida o formulário antes de enviar
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Em um app real, aqui seria feita a chamada à API
      // POST /api/auth/login
      await login(email, password);
      
      // Simulação de login bem-sucedido
      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado para o dashboard",
      });
      
      // Redirecionar baseado no papel do usuário (na aplicação real, o redirecionamento
      // seria baseado no papel retornado pela API)
      if (email.includes("admin")) {
        navigate("/dashboard");
      } else if (email.includes("colab")) {
        navigate("/tasks");
      } else {
        navigate("/dashboard"); // cliente
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary">Agency App</h1>
          <p className="mt-2 text-gray-600">Gerenciamento de projetos e aprovações para agências</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Manter conectado
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Ainda não tem uma conta?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Fale com a nossa equipe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
