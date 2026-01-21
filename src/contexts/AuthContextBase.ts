import { createContext } from "react";

export type AuthUser = { id: string; email: string } | null;

export type AuthState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: AuthUser;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
};

export type AuthContextType = {
  state: AuthState;
  actions: AuthActions;
};

export const AuthContext = createContext<AuthContextType | null>(null);