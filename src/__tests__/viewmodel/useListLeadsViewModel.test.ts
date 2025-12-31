import { renderHook, act } from "@testing-library/react";
import { useListLeadsViewModel } from "../../viewmodel/useListLeadsViewModel";
import { Lead } from "../../model/entities/Lead";

jest.mock("../../model/repositories/leadRepository", () => ({
  leadRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("useListLeadsViewModel", () => {
  const mockRepo =
    require("../../model/repositories/leadRepository").leadRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useListLeadsViewModel());
    expect(result.current.state.leads).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test("should load leads successfully", async () => {
    const mockLeads: Lead[] = [
      {
        id: "1",
        nome: "Lead 1",
        email: "lead1@test.com",
        cpf: "12345678900",
        telefone: "111111111",
        timeStamp: Date.now(),
      },
    ];
    mockRepo.getAll.mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useListLeadsViewModel());

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.leads).toEqual(mockLeads);
    expect(result.current.state.originalLeads).toEqual(mockLeads);
  });

  test("should filter leads by name", async () => {
    const mockLeads: Lead[] = [
      {
        id: "1",
        nome: "Alice",
        email: "alice@test.com",
        cpf: "11111111111",
        telefone: "111",
        timeStamp: Date.now(),
      },
      {
        id: "2",
        nome: "Bob",
        email: "bob@test.com",
        cpf: "22222222222",
        telefone: "222",
        timeStamp: Date.now(),
      },
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

  test("should reset filter", async () => {
    const mockLeads: Lead[] = [
      {
        id: "1",
        nome: "Alice",
        email: "alice@test.com",
        cpf: "11111111111",
        telefone: "111",
        timeStamp: Date.now(),
      },
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

    act(() => {
      result.current.actions.resetFilter();
    });

    expect(result.current.state.leads).toHaveLength(1);
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
  });
});
