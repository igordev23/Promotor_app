import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../model/services/AuthService";
import { journeyUseCase } from "../useCases/JourneyUseCase";
import { leadUseCase } from "../useCases/LeadUseCase";
import { locationUseCase } from "../useCases/LocationUseCase";
import { JourneyContext, JourneyContextType, JourneyState } from "./JourneyContextBase";

const ACTIVE_SINCE_KEY = "journey_active_since";

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSince, setActiveSince] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Função setState genérica para o contexto
  const setState = useCallback((newState: Partial<JourneyState>) => {
    if (newState.userName !== undefined) setUserName(newState.userName);
    if (newState.isWorking !== undefined) setIsWorking(newState.isWorking);
    if (newState.totalLeads !== undefined) setTotalLeads(newState.totalLeads);
    if (newState.loading !== undefined) setLoading(newState.loading);
    if (newState.error !== undefined) setError(newState.error);
    if (newState.activeSince !== undefined) setActiveSince(newState.activeSince);
    if (newState.elapsedMs !== undefined) setElapsedMs(newState.elapsedMs);
  }, []);

  // Carrega dados iniciais
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
            : journey.inicio ?? Date.now();
        setActiveSince(start || Date.now());
      } else {
        setActiveSince(null);
        setElapsedMs(0);
        await AsyncStorage.removeItem(ACTIVE_SINCE_KEY);
      }

      const leads = await leadUseCase.getLeads();
      setTotalLeads(leads.length);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Alterna status de jornada
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
          const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
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
        setIsWorking(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao alterar status de trabalho";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isWorking]);

  // Atualiza tempo ativo
  useEffect(() => {
    let timer: NodeJS.Timer | number | undefined;
    if (isWorking && activeSince) {
      const update = () => setElapsedMs(Date.now() - activeSince);
      update();
      timer = setInterval(update, 1000);
    }
    return () => {
      if (timer) clearInterval(timer as any);
    };
  }, [isWorking, activeSince]);

  const value = useMemo<JourneyContextType>(
    () => ({
      state: { userName, isWorking, totalLeads, loading, error, activeSince, elapsedMs },
      actions: { loadData, toggleWorkStatus },
      setState,
    }),
    [userName, isWorking, totalLeads, loading, error, activeSince, elapsedMs, loadData, toggleWorkStatus, setState]
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}
