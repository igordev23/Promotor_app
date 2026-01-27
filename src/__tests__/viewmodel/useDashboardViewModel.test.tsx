import { renderHook, act, waitFor } from "@testing-library/react";
import { useDashboardViewModel } from "../../viewmodel/useDashboardViewModel";
import { authService } from "../../model/services/AuthService";
import { journeyUseCase } from "../../useCases/JourneyUseCase";
import { leadUseCase } from "../../useCases/LeadUseCase";
import { JourneyContext } from "../../contexts/JourneyContextBase";
import React from "react";

jest.mock("../../model/services/AuthService");
jest.mock("../../useCases/JourneyUseCase");
jest.mock("../../useCases/LeadUseCase");
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("useDashboardViewModel", () => {
  const mockUser = { id: "user-123", email: "promotor@test.com", senha: "12345678" };

  const TestJourneyProvider = ({ children }: { children: React.ReactNode }) => {
    const [userName, setUserName] = React.useState("");
    const [isWorking, setIsWorking] = React.useState(false);
    const [totalLeads, setTotalLeads] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [activeSince, setActiveSince] = React.useState<number | null>(null);
    const [elapsedMs, setElapsedMs] = React.useState(0);

    const setState = (newState: Partial<{
      userName: string;
      isWorking: boolean;
      totalLeads: number;
      loading: boolean;
      error: string | null;
      activeSince: number | null;
      elapsedMs: number;
    }>) => {
      if (newState.userName !== undefined) setUserName(newState.userName);
      if (newState.isWorking !== undefined) setIsWorking(newState.isWorking);
      if (newState.totalLeads !== undefined) setTotalLeads(newState.totalLeads);
      if (newState.loading !== undefined) setLoading(newState.loading);
      if (newState.error !== undefined) setError(newState.error);
      if (newState.activeSince !== undefined) setActiveSince(newState.activeSince);
      if (newState.elapsedMs !== undefined) setElapsedMs(newState.elapsedMs);
    };

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await authService.getUser();
        if (!user) throw new Error("Usuário não autenticado");
        setUserName(user.email || "Promotor");

        const journey = await journeyUseCase.getJourneyStatus(user.id);
        const working = journey.status === "ativo";
        setIsWorking(working);
        setActiveSince(working ? Date.now() : null);
        setElapsedMs(working ? 0 : 0);

        const leads = await leadUseCase.getLeads();
        setTotalLeads(leads.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    const toggleWorkStatus = async () => {
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
        } else {
          await journeyUseCase.startJourney(user.id);
          setIsWorking(true);
          setActiveSince(Date.now());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    const value = {
      state: { userName, isWorking, totalLeads, loading, error, activeSince, elapsedMs },
      actions: { loadData, toggleWorkStatus },
      setState,
    };

    return React.createElement(JourneyContext.Provider, { value }, children);
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (authService.getUser as jest.Mock).mockResolvedValue(mockUser);

    (journeyUseCase.startJourney as jest.Mock).mockResolvedValue(undefined);
    (journeyUseCase.endJourney as jest.Mock).mockResolvedValue(undefined);
  });

  test("should load initial data correctly", async () => {
    (journeyUseCase.getJourneyStatus as jest.Mock).mockResolvedValue({
      status: "inativo",
      promotor_id: mockUser.id,
    });

    (leadUseCase.getLeads as jest.Mock).mockResolvedValue([
      { id: "1" },
      { id: "2" },
    ]);

    const { result } = renderHook(() => useDashboardViewModel(), {
      wrapper: ({ children }) => React.createElement(TestJourneyProvider, null, children),
    });

    await waitFor(() => {
      expect(authService.getUser).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.state.userName).toBe(mockUser.email);
    });

    expect(journeyUseCase.getJourneyStatus).toHaveBeenCalledWith(mockUser.id);
    expect(leadUseCase.getLeads).toHaveBeenCalled();

    expect(result.current.state.isWorking).toBe(false);
    expect(result.current.state.totalLeads).toBe(2);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test("should handle start journey", async () => {
    (journeyUseCase.getJourneyStatus as jest.Mock)
      .mockResolvedValueOnce({
        status: "inativo",
        promotor_id: mockUser.id,
      })
      .mockResolvedValue({
        status: "ativo",
        promotor_id: mockUser.id,
      });

    (leadUseCase.getLeads as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useDashboardViewModel(), {
      wrapper: ({ children }) => React.createElement(TestJourneyProvider, null, children),
    });

    await waitFor(() => {
      expect(authService.getUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current.state.isWorking).toBe(false);
    });

    await act(async () => {
      await result.current.actions.toggleWorkStatus();
    });

    expect(journeyUseCase.startJourney).toHaveBeenCalledWith(mockUser.id);
    expect(result.current.state.isWorking).toBe(true);
  });

  test("should handle end journey", async () => {
    (journeyUseCase.getJourneyStatus as jest.Mock)
      .mockResolvedValueOnce({
        status: "ativo",
        promotor_id: mockUser.id,
      })
      .mockResolvedValue({
        status: "inativo",
        promotor_id: mockUser.id,
      });

    (leadUseCase.getLeads as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useDashboardViewModel(), {
      wrapper: ({ children }) => React.createElement(TestJourneyProvider, null, children),
    });

    await waitFor(() => {
      expect(authService.getUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current.state.isWorking).toBe(true);
    });

    await act(async () => {
      await result.current.actions.toggleWorkStatus();
    });

    expect(journeyUseCase.endJourney).toHaveBeenCalledWith(mockUser.id);
    expect(result.current.state.isWorking).toBe(false);
  });

  test("should handle errors during loadData", async () => {
    (authService.getUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useDashboardViewModel(), {
      wrapper: ({ children }) => React.createElement(TestJourneyProvider, null, children),
    });

    await act(async () => {
      await result.current.actions.loadData();
    });

    expect(result.current.state.error).toBe("Usuário não autenticado");
    expect(result.current.state.loading).toBe(false);

    expect(journeyUseCase.getJourneyStatus).not.toHaveBeenCalled();
    expect(leadUseCase.getLeads).not.toHaveBeenCalled();
  });
});