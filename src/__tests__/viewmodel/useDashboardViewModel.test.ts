import { renderHook, act } from "@testing-library/react";
import { useDashboardViewModel } from "../../viewmodel/useDashboardViewModel";
import { authService } from "../../model/services/AuthService";
import { journeyUseCase } from "../../useCases/JourneyUseCase";
import { leadUseCase } from "../../useCases/LeadUseCase";

// Mocks
jest.mock("../../model/services/AuthService");
jest.mock("../../useCases/JourneyUseCase");
jest.mock("../../useCases/LeadUseCase");

describe("useDashboardViewModel", () => {
  const mockUser = { id: "user-123", email: "test@test.com" };

  beforeEach(() => {
    jest.clearAllMocks();

    (authService.getUser as jest.Mock).mockResolvedValue(mockUser);

    // Garantir que esses métodos existem e são rastreáveis
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

    const { result } = renderHook(() => useDashboardViewModel());

    await act(async () => {
      await result.current.actions.loadData();
    });

    expect(authService.getUser).toHaveBeenCalledTimes(1);
    expect(journeyUseCase.getJourneyStatus).toHaveBeenCalledWith(mockUser.id);
    expect(leadUseCase.getLeads).toHaveBeenCalled();

    expect(result.current.state.userName).toBe(mockUser.email);
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

    const { result } = renderHook(() => useDashboardViewModel());

    await act(async () => {
      await result.current.actions.loadData();
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

    const { result } = renderHook(() => useDashboardViewModel());

    await act(async () => {
      await result.current.actions.loadData();
    });

    await act(async () => {
      await result.current.actions.toggleWorkStatus();
    });

    expect(journeyUseCase.endJourney).toHaveBeenCalledWith(mockUser.id);
    expect(result.current.state.isWorking).toBe(false);
  });

  test("should handle errors during loadData", async () => {
    (authService.getUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useDashboardViewModel());

    await act(async () => {
      await result.current.actions.loadData();
    });

    expect(result.current.state.error).toBe("Usuário não autenticado");
    expect(result.current.state.loading).toBe(false);

    expect(journeyUseCase.getJourneyStatus).not.toHaveBeenCalled();
    expect(leadUseCase.getLeads).not.toHaveBeenCalled();
  });
});
