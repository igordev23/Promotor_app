import { useContext, useEffect, useCallback } from "react";
import { JourneyContext } from "../contexts/JourneyContextBase";
import { authService } from "../model/services/AuthService";
import { router } from "expo-router";

export type DashboardState = {
  userName: string;
  isWorking: boolean;
  totalLeads: number;
  loading: boolean;
  error: string | null;
  activeSince?: number | null;
  elapsedMs: number;
};

export type DashboardActions = {
  loadData: () => Promise<void>;
  toggleWorkStatus: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useDashboardViewModel = (): {
  state: DashboardState;
  actions: DashboardActions;
} => {
  const ctx = useContext(JourneyContext);

  if (!ctx) {
    throw new Error(
      "useDashboardViewModel deve ser usado dentro de JourneyProvider"
    );
  }

  const { state, actions, setState } = ctx;

  // Atualiza o tempo de jornada ativa a cada segundo
  useEffect(() => {
    let interval: number | undefined;
    if (state.isWorking && state.activeSince) {
      const update = () =>
        setState({ elapsedMs: Date.now() - state.activeSince! });
      update();
      interval = setInterval(update, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isWorking, state.activeSince, setState]);

  // Carrega dados ao montar
  useEffect(() => {
    actions.loadData();
  }, []);

  // Função de logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      router.replace("/loginScreen");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }, []);

  return { state, actions: { ...actions, logout } };
};
