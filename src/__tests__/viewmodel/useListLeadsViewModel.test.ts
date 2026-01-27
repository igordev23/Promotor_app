import { renderHook, act } from "@testing-library/react";
import { useListLeadsViewModel } from "../../viewmodel/useListLeadsViewModel";
import { Lead } from "../../model/entities/Lead";
import { leadRepository } from "../../model/repositories/leadRepository";

jest.mock("../../model/repositories/leadRepository", () => ({
  leadRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockRepo = leadRepository as jest.Mocked<typeof leadRepository>;

describe("useListLeadsViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useListLeadsViewModel());

    expect(result.current.state.leads).toEqual([]);
    expect(result.current.state.originalLeads).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test("should load leads successfully", async () => {
    const mockLeads: Lead[] = [
      {
        id: "1",
        nome: "Lead 1",
        cpf: "12345678900",
        telefone: "111111111",
      },
    ];

    mockRepo.getAll.mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useListLeadsViewModel());

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.leads).toEqual(mockLeads);
    expect(result.current.state.originalLeads).toEqual(mockLeads);
  });

  test("should filter leads by name", async () => {
    const mockLeads: Lead[] = [
      { id: "1", nome: "Alice", cpf: "111", telefone: "111" },
      { id: "2", nome: "Bob", cpf: "222", telefone: "222" },
    ];

    mockRepo.getAll.mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useListLeadsViewModel());

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    act(() => {
      result.current.actions.searchLeads("alice");
    });

    expect(result.current.state.leads).toHaveLength(1);
    expect(result.current.state.leads[0].nome).toBe("Alice");
  });

  test("should reset filter and restore original leads", async () => {
    const mockLeads: Lead[] = [
      { id: "1", nome: "Alice", cpf: "111", telefone: "111" },
      { id: "2", nome: "Bob", cpf: "222", telefone: "222" },
    ];

    mockRepo.getAll.mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useListLeadsViewModel());

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    // Aplica filtro que reduz a lista
    act(() => {
      result.current.actions.searchLeads("alice");
    });

    expect(result.current.state.leads).toHaveLength(1);

    // Reseta filtro
    act(() => {
      result.current.actions.resetFilter();
    });

    expect(result.current.state.leads).toEqual(mockLeads);
    expect(result.current.state.originalLeads).toEqual(mockLeads);
  });

  test("should handle error when loading leads fails", async () => {
    mockRepo.getAll.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useListLeadsViewModel());

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe("Network error");
    expect(result.current.state.leads).toEqual([]);
    expect(result.current.state.originalLeads).toEqual([]);
  });
});