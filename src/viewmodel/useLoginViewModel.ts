import { useState } from "react";
import { authService } from "../model/services/AuthService";

export type LoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

export type LoginActions = {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
};

export const useLoginViewModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await authService.login(email, password);
      if (success) {
        setIsAuthenticated(true);
        return true;
      } else {
        setError("Credenciais inválidas");
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro no login";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    alert("logoutado")
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Erro no logout:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (err) {
      console.error("Erro ao verificar status de autenticação:", err);
      setIsAuthenticated(false);
    }
  };

  return {
    state: {
      loading,
      error,
      isAuthenticated,
    },
    actions: {
      login,
      logout,
      clearError,
      checkAuthStatus,
    },
  };
};
