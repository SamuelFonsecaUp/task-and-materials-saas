
import { Loader2 } from "lucide-react";

/**
 * Loading screen component
 */
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
    <p className="text-lg font-medium">Loading...</p>
  </div>
);

export default LoadingScreen;
