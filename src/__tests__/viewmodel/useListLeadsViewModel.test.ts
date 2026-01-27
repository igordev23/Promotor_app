import { renderHook, act } from "@testing-library/react";
import { useListLeadsViewModel } from "../../viewmodel/useListLeadsViewModel";
import { Lead } from "../../model/entities/Lead";
import { leadRepository } from "../../model/repositories/leadRepository";
import { leadUseCase } from "../../useCases/LeadUseCase";

jest.mock("../../useCases/LeadUseCase", () => ({
  leadUseCase: {
    getLeads: jest.fn(),
    removeLead: jest.fn(),
    filterLeads: jest.fn(),
    parseError: jest.fn(),
  },
}));
const mockUseCase = leadUseCase as jest.Mocked<typeof leadUseCase>;


const mockRepo = leadUseCase as jest.Mocked<typeof leadUseCase>;

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

    mockUseCase.getLeads.mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useListLeadsViewModel());

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    expect(mockUseCase.getLeads).toHaveBeenCalledTimes(1);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.leads).toEqual(mockLeads);
    expect(result.current.state.originalLeads).toEqual(mockLeads);
  });
  test("should update search query and filter leads", async () => {
  const leads = [
    { id: "1", nome: "Alice", cpf: "1", telefone: "1" },
    { id: "2", nome: "Bob", cpf: "2", telefone: "2" },
  ];

  mockUseCase.getLeads.mockResolvedValue(leads);
  mockUseCase.filterLeads.mockReturnValue([leads[0]]);

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  act(() => {
    result.current.actions.updateSearchQuery("ali");
  });

  expect(result.current.state.busca).toBe("ali");
  expect(result.current.state.leads).toHaveLength(1);
});


  test("should filter leads by name", async () => {
    const mockLeads: Lead[] = [
      { id: "1", nome: "Alice", cpf: "111", telefone: "111" },
      { id: "2", nome: "Bob", cpf: "222", telefone: "222" },
    ];

    mockUseCase.getLeads.mockResolvedValue(mockLeads);

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
  test("should clear error", async () => {
  mockUseCase.getLeads.mockRejectedValue(new Error("Erro"));
  mockUseCase.parseError.mockReturnValue("Erro");

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  expect(result.current.state.error).toBe("Erro");

  act(() => {
    result.current.actions.clearError();
  });

  expect(result.current.state.error).toBeNull();
});
test("should toggle lead selection", async () => {
  const leads = [{ id: "1", nome: "Alice", cpf: "1", telefone: "1" }];
  mockUseCase.getLeads.mockResolvedValue(leads);

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  act(() => result.current.actions.toggleSelectLead("1"));
  expect(result.current.state.selectedLeads).toEqual(["1"]);

  act(() => result.current.actions.toggleSelectLead("1"));
  expect(result.current.state.selectedLeads).toEqual([]);
});
test("should select and deselect all leads", async () => {
  const leads = [
    { id: "1", nome: "A", cpf: "1", telefone: "1" },
    { id: "2", nome: "B", cpf: "2", telefone: "2" },
  ];

  mockUseCase.getLeads.mockResolvedValue(leads);

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  act(() => result.current.actions.selectAll());
  expect(result.current.state.selectedLeads).toEqual(["1", "2"]);

  act(() => result.current.actions.selectAll());
  expect(result.current.state.selectedLeads).toEqual([]);
});
test("should remove lead successfully", async () => {
  const leads = [{ id: "1", nome: "A", cpf: "1", telefone: "1" }];
  mockUseCase.getLeads.mockResolvedValue(leads);
  mockUseCase.removeLead.mockResolvedValue(undefined);

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  await act(async () => {
    await result.current.actions.removeLead("1");
  });

  expect(result.current.state.leads).toEqual([]);
  expect(result.current.state.successMessage).toBe("Lead excluído com sucesso!");
});
test("should throw error when removing without selection", async () => {
  const { result } = renderHook(() => useListLeadsViewModel());

  await expect(
    act(async () => {
      await result.current.actions.removeSelected();
    })
  ).rejects.toThrow("Nenhum lead selecionado");
});
test("should remove selected leads", async () => {
  const leads = [
    { id: "1", nome: "A", cpf: "1", telefone: "1" },
    { id: "2", nome: "B", cpf: "2", telefone: "2" },
  ];

  mockUseCase.getLeads.mockResolvedValue(leads);
  mockUseCase.removeLead.mockResolvedValue(undefined);

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  act(() => result.current.actions.toggleSelectLead("1"));
  act(() => result.current.actions.toggleSelectLead("2"));

  await act(async () => {
    await result.current.actions.removeSelected();
  });

  expect(result.current.state.leads).toEqual([]);
  expect(result.current.state.successMessage).toBe("2 leads excluídos com sucesso!");
});


  test("should reset filter and restore original leads", async () => {
    const mockLeads: Lead[] = [
      { id: "1", nome: "Alice", cpf: "111", telefone: "111" },
      { id: "2", nome: "Bob", cpf: "222", telefone: "222" },
    ];

    mockUseCase.getLeads.mockResolvedValue(mockLeads);

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
  mockUseCase.getLeads.mockRejectedValue(new Error("Network error"));
  mockUseCase.parseError.mockReturnValue("Erro");

  const { result } = renderHook(() => useListLeadsViewModel());

  await act(async () => {
    await result.current.actions.loadLeads();
  });

  expect(result.current.state.loading).toBe(false);
  expect(result.current.state.error).toBe("Erro");
  expect(result.current.state.leads).toEqual([]);
  expect(result.current.state.originalLeads).toEqual([]);
});

});