// src/viewmodel/useDashboardViewModel.ts
import { useContext, useMemo } from "react";
import { JourneyContext } from "../contexts/JourneyContextBase";
import { JourneyState, JourneyActions } from "../contexts/types";

// Tipos específicos para o Dashboard
export interface DashboardState {
  userName: string;
  isWorking: boolean;
  totalLeads: number;
  loading: boolean;
  error: string | null;
  activeSince?: number | null;
  elapsedMs: number;
}

export interface DashboardActions {
  loadData: () => Promise<number | void>;
  toggleWorkStatus: () => Promise<number | void>;
}

export interface DashboardViewModel {
  state: DashboardState;
  actions: DashboardActions;
}

// Interface para o contexto do Journey
interface JourneyContextValue {
  state: JourneyState;
  actions: JourneyActions;
}

// Constantes de erro
const ERROR_MESSAGES = {
  CONTEXT_NOT_FOUND: "useDashboardViewModel deve ser usado dentro de JourneyProvider",
} as const;

// Hook principal
export const useDashboardViewModel = (): DashboardViewModel => {
  const context = useContext<JourneyContextValue | undefined>(JourneyContext);

  if (!context) {
    throw new Error(ERROR_MESSAGES.CONTEXT_NOT_FOUND);
  }

  const { state, actions } = context;

  // Mapeia o estado do contexto para o estado do dashboard
  const dashboardState: DashboardState = useMemo(() => ({
    userName: state.userName || "",
    isWorking: state.isWorking,
    totalLeads: state.totalLeads,
    loading: state.loading,
    error: state.error,
    activeSince: state.activeSince,
    elapsedMs: state.elapsedMs,
  }), [state]);

  // Mapeia as ações do contexto para as ações do dashboard
  const dashboardActions: DashboardActions = useMemo(() => ({
    loadData: async (): Promise<number | void> => {
      try {
        return await actions.loadData();
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        throw error;
      }
    },
    toggleWorkStatus: async (): Promise<number | void> => {
      try {
        return await actions.toggleWorkStatus();
      } catch (error) {
        console.error("Erro ao alternar status da jornada:", error);
        throw error;
      }
    },
  }), [actions]);

  return {
    state: dashboardState,
    actions: dashboardActions,
  };
};

// Hook auxiliar para verificar disponibilidade do contexto
export const useJourneyContext = (): JourneyContextValue => {
  const context = useContext<JourneyContextValue | undefined>(JourneyContext);

  if (!context) {
    throw new Error(ERROR_MESSAGES.CONTEXT_NOT_FOUND);
  }

  return context;
};