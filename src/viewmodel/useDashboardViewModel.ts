import { useState, useCallback } from "react";
import { authService } from "../model/services/AuthService";
import { journeyUseCase } from "../useCases/JourneyUseCase";
import { leadUseCase } from "../useCases/LeadUseCase";
import { locationUseCase } from "../useCases/LocationUseCase";

export type DashboardState = {
  userName: string;
  isWorking: boolean;
  totalLeads: number;
  loading: boolean;
  error: string | null;
};

export type DashboardActions = {
  loadData: () => Promise<void>;
  toggleWorkStatus: () => Promise<void>;
};

export const useDashboardViewModel = (): {
  state: DashboardState;
  actions: DashboardActions;
} => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      setUserName(user.email || "Promotor");

      const journey = await journeyUseCase.getJourneyStatus(user.id);
      setIsWorking(journey.status === "ativo");

      const leads = await leadUseCase.getLeads();
      setTotalLeads(leads.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWorkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      if (isWorking) {
        await journeyUseCase.endJourney(user.id);
      } else {
        await journeyUseCase.startJourney(user.id);
        try {
          const ExpoLocation = await import("expo-location");
          const { status } =
            await ExpoLocation.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const current = await ExpoLocation.getCurrentPositionAsync({});
            await locationUseCase.sendLocation({
              idPromotor: user.id,
              latitude: current.coords.latitude,
              longitude: current.coords.longitude,
              timestamp: Date.now(),
            });
          }
        } catch {}
      }
      const journey = await journeyUseCase.getJourneyStatus(user.id);
      setIsWorking(journey.status === "ativo");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao alterar status de trabalho";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isWorking]);

  return {
    state: {
      userName,
      isWorking,
      totalLeads,
      loading,
      error,
    },
    actions: {
      loadData,
      toggleWorkStatus,
    },
  };
};
