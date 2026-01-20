import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../model/services/AuthService";
import { journeyUseCase } from "../useCases/JourneyUseCase";
import { leadUseCase } from "../useCases/LeadUseCase";
import { locationUseCase } from "../useCases/LocationUseCase";
import { JourneyContext, JourneyContextType } from "./JourneyContextBase";

const ACTIVE_SINCE_KEY = "journey_active_since";

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [activeSince, setActiveSince] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      setUserName(user.email || "Promotor");

      const journey = await journeyUseCase.getJourneyStatus(user.id);
      setIsWorking(journey.status === "ativo");
      if (journey.status === "ativo") {
        const stored = await AsyncStorage.getItem(ACTIVE_SINCE_KEY);
        const start =
          stored !== null
            ? Number(stored)
            : typeof journey.inicio === "string"
            ? Date.parse(journey.inicio)
            : (journey.inicio ?? Date.now());
        setActiveSince(start || Date.now());
      } else {
        setActiveSince(null);
        setElapsedMs(0);
        await AsyncStorage.removeItem(ACTIVE_SINCE_KEY);
      }

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
        setIsWorking(false);
        setActiveSince(null);
        setElapsedMs(0);
        await AsyncStorage.removeItem(ACTIVE_SINCE_KEY);
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
        const now = Date.now();
        setActiveSince(now);
        await AsyncStorage.setItem(ACTIVE_SINCE_KEY, String(now));
      }
      const journey = await journeyUseCase.getJourneyStatus(user.id);
      setIsWorking(journey.status === "ativo");
      if (journey.status === "ativo") {
        const stored = await AsyncStorage.getItem(ACTIVE_SINCE_KEY);
        const start =
          stored !== null
            ? Number(stored)
            : typeof journey.inicio === "string"
            ? Date.parse(journey.inicio)
            : (journey.inicio ?? Date.now());
        setActiveSince(start || Date.now());
      } else {
        setActiveSince(null);
        setElapsedMs(0);
        await AsyncStorage.removeItem(ACTIVE_SINCE_KEY);
      }
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

  useEffect(() => {
    let timer: any;
    if (isWorking && activeSince) {
      const update = () => {
        setElapsedMs(Date.now() - activeSince);
      };
      update();
      timer = setInterval(update, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWorking, activeSince]);

  const value = useMemo<JourneyContextType>(() => ({
    state: {
      userName,
      isWorking,
      totalLeads,
      loading,
      error,
      activeSince,
      elapsedMs,
    },
    actions: {
      loadData,
      toggleWorkStatus,
    },
  }), [userName, isWorking, totalLeads, loading, error, activeSince, elapsedMs, loadData, toggleWorkStatus]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

