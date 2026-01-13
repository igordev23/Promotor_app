import { renderHook, act, waitFor } from "@testing-library/react";
import { useLeadRegisterViewModel } from "../../viewmodel/useLeadRegisterViewModel";
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

describe("useLeadRegisterViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with default state", async () => {
    mockRepo.getAll.mockResolvedValue([]);

    const { result } = renderHook(() => useLeadRegisterViewModel());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.error).toBeNull();
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

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    expect(result.current.state.error).toBeNull();
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
  });

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
  });

  test("should handle repository error when registering lead", async () => {
    mockRepo.create.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Test",
        cpf: "12345678900",
        telefone: "123456789",
      });
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.error).toBe("Network error");
  });
});
