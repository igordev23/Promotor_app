import { createContext } from "react";

export type JourneyState = {
  userName: string;
  isWorking: boolean;
  totalLeads: number;
  loading: boolean;
  error: string | null;
  activeSince: number | null;
  elapsedMs: number;
};

export type JourneyActions = {
  loadData: () => Promise<void>;
  toggleWorkStatus: () => Promise<void>;
};

export type JourneyContextType = {
  state: JourneyState;
  actions: JourneyActions;
  setState: (state: Partial<JourneyState>) => void;
};

export const JourneyContext = createContext<JourneyContextType | null>(null);
