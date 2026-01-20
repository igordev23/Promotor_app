import React, { useCallback, useMemo, useState } from "react";
import { authService } from "../model/services/AuthService";
import { AuthContext, AuthContextType, AuthUser } from "./AuthContextBase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);

  const refreshUser = useCallback(async () => {
    try {
      const u = await authService.getUser();
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const ok = await authService.isAuthenticated();
      setIsAuthenticated(ok);
      if (ok) {
        await refreshUser();
      } else {
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const ok = await authService.login(email, password);
      if (ok) {
        setIsAuthenticated(true);
        await refreshUser();
        return true;
      }
      setError("Credenciais inválidas");
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro no login";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    state: { loading, error, isAuthenticated, user },
    actions: { login, logout, checkAuthStatus, clearError, refreshUser },
  }), [loading, error, isAuthenticated, user, login, logout, checkAuthStatus, clearError, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

