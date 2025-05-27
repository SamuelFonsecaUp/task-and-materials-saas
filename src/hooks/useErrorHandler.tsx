
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastMessage?: string;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: any, 
    context: string = 'Unknown context',
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastMessage,
      logError = true,
    } = options;

    // Log error for debugging
    if (logError) {
      console.error(`Error in ${context}:`, {
        error,
        message: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
      });
    }

    // Show user-friendly toast
    if (showToast) {
      const message = toastMessage || getErrorMessage(error);
      toast.error(message);
    }

    return error;
  }, []);

  return { handleError };
};

const getErrorMessage = (error: any): string => {
  if (!error) return 'Erro desconhecido';

  // Handle authentication errors
  if (error.message?.includes('not authenticated') || error.status === 401) {
    return 'Você precisa estar logado para realizar esta ação';
  }

  // Handle network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente';
  }

  // Handle Supabase errors
  if (error.message?.includes('duplicate key')) {
    return 'Este item já existe no sistema';
  }

  if (error.message?.includes('foreign key')) {
    return 'Não é possível realizar esta ação devido a dependências';
  }

  // Generic error message
  return error.message || 'Ocorreu um erro inesperado';
};
