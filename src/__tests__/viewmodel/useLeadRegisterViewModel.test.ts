import { renderHook, act } from "@testing-library/react";
import { useLeadRegisterViewModel } from "../../viewmodel/useLeadRegisterViewModel";
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

describe("useLeadRegisterViewModel", () => {
  const mockRepo =
    require("../../model/repositories/leadRepository").leadRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should register a valid lead", async () => {
    const newLead: Lead = {
      id: "1",
      nome: "Valid Lead",
      cpf: "12345678900",
      telefone: "123456789",
    };
    mockRepo.create.mockResolvedValue(newLead);
    mockRepo.getAll.mockResolvedValue([newLead]);

    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Valid Lead",
        cpf: "12345678900",
        telefone: "123456789",
      });
    });

    expect(result.current.state.error).toBeNull();
    expect(mockRepo.create).toHaveBeenCalledWith({
      nome: "Valid Lead",
      cpf: "12345678900",
      telefone: "123456789",
    });
  });

  test("should fail if name is empty", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "",
        cpf: "12345678900",
        telefone: "123456789",
      });
    });

    expect(result.current.state.error).toBe("Nome é obrigatório");
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  // email removido do fluxo

  test("should fail if cpf is invalid (length)", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Test",
        cpf: "123",
        telefone: "123456789",
      });
    });

    expect(result.current.state.error).toBe("CPF deve ter 11 dígitos");
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  test("should fail if cpf is empty", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Test",
        cpf: "",
        telefone: "123456789",
      });
    });

    expect(result.current.state.error).toBe("CPF é obrigatório");
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  // TDD 1

  test("TDD: deveria remover um lead", async () => {
    const lead1: Lead = {
      id: "1",
      nome: "Carlos",
      cpf: "12345678900",
      telefone: "999999999",
    };

    const lead2: Lead = {
      id: "2",
      nome: "Maria",
      cpf: "09876543211",
      telefone: "888888888",
    };

    mockRepo.getAll.mockResolvedValue([lead1, lead2]);
    mockRepo.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLeadRegisterViewModel());

    // carrega leads
    await act(async () => {
      await result.current.actions.loadLeads();
    });

    // REMOVE (função ainda NÃO EXISTE)
    await act(async () => {
      await result.current.actions.removeLead("1");
    });

    expect(mockRepo.delete).toHaveBeenCalledWith("1");
    expect(result.current.state.leads).toEqual([lead2]);
  });
});
