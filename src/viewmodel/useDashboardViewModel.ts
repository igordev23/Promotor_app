import { useContext } from "react";
import { JourneyContext } from "../contexts/JourneyContextBase";

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
  loadData: () => Promise<number | void>;
  toggleWorkStatus: () => Promise<number | void>;
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

  return {
    state: ctx.state,
    actions: ctx.actions,
  };
};
