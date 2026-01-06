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
  });

  test("should load initial data correctly", async () => {
    // Setup mocks
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

    expect(result.current.state.userName).toBe(mockUser.email);
    expect(result.current.state.isWorking).toBe(false);
    expect(result.current.state.totalLeads).toBe(2);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test("should handle start journey", async () => {
    // Initial state: inactive
    (journeyUseCase.getJourneyStatus as jest.Mock)
      .mockResolvedValueOnce({ status: "inativo", promotor_id: mockUser.id }) // Initial check
      .mockResolvedValueOnce({ status: "ativo", promotor_id: mockUser.id }); // After toggle

    const { result } = renderHook(() => useDashboardViewModel());

    // Load data first to set initial state (optional depending on implementation, but good practice)
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
    // Initial state: active
    (journeyUseCase.getJourneyStatus as jest.Mock)
      .mockResolvedValueOnce({ status: "ativo", promotor_id: mockUser.id })
      .mockResolvedValueOnce({ status: "inativo", promotor_id: mockUser.id });

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
    (authService.getUser as jest.Mock).mockResolvedValue(null); // Simulate no user

    const { result } = renderHook(() => useDashboardViewModel());

    await act(async () => {
      await result.current.actions.loadData();
    });

    expect(result.current.state.error).toBe("Usuário não autenticado");
    expect(result.current.state.loading).toBe(false);
  });
});
