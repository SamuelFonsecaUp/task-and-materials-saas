
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Carregando..." }: LoadingScreenProps) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <p className="text-lg font-medium text-muted-foreground">{message}</p>
  </div>
);

export default LoadingScreen;
