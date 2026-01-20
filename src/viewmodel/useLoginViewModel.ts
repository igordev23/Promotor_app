import { useContext, useState } from "react";
import { authService } from "../model/services/AuthService";
import { AuthContext } from "../contexts/AuthContextBase";

export type LoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

export type LoginActions = {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearError: () => string | null;
  checkAuthStatus: () => Promise<boolean>;
};

export const useLoginViewModel = () => {
  const ctx = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  setError(null);

  try {
    await authService.login(email, password);

    setIsAuthenticated(true);
    return true;

  } catch (err) {
    let errorMessage = "Erro inesperado ao realizar login";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    setError(errorMessage);
    return false;

  } finally {
    setLoading(false);
  }
};


  const logout = async (): Promise<void> => {
    setLoading(true);
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

  if (ctx) {
    return {
      state: {
        loading: ctx.state.loading,
        error: ctx.state.error,
        isAuthenticated: ctx.state.isAuthenticated,
      },
      actions: {
        login: ctx.actions.login,
        logout: ctx.actions.logout,
        clearError: ctx.actions.clearError,
        checkAuthStatus: ctx.actions.checkAuthStatus,
      },
    };
  } else {
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
  }
};
