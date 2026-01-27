import { renderHook, act, waitFor } from "@testing-library/react";
import { useLeadRegisterViewModel } from "../../viewmodel/useLeadRegisterViewModel";
import { Lead } from "../../model/entities/Lead";
import { leadUseCase } from "../../useCases/LeadUseCase";
import { ValidationError } from "../../errors/ValidationError";

jest.mock("../../useCases/LeadUseCase", () => ({
  leadUseCase: {
    createLead: jest.fn(),
    parseError: (err: any) => (err instanceof Error ? err.message : String(err)),
  },
}));

const mockUseCase = leadUseCase as jest.Mocked<typeof leadUseCase>;

describe("useLeadRegisterViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with default state", async () => {
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
      telefone: "11912345678",
    };

    mockUseCase.createLead.mockResolvedValue(newLead);

    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      result.current.actions.updateField("nome", "Valid Lead");
      result.current.actions.updateField("cpf", "12345678900");
      result.current.actions.updateField("telefone", "11912345678");
      await result.current.actions.registerLead();
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(mockUseCase.createLead).toHaveBeenCalledTimes(1);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.fieldErrors).toEqual({});
    expect(result.current.state.success).toBe(true);
  });

  test("should fail if name is empty", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      result.current.actions.updateField("nome", "");
      result.current.actions.updateField("cpf", "12345678900");
      result.current.actions.updateField("telefone", "11912345678");
      mockUseCase.createLead.mockRejectedValueOnce(
        new ValidationError("nome", "Nome é obrigatório")
      );
      await result.current.actions.registerLead();
    });

    await waitFor(() => {
      expect(result.current.state.fieldErrors.nome).toBe("Nome é obrigatório");
    });
    expect(mockUseCase.createLead).toHaveBeenCalledTimes(1);
  });

  test("should fail if cpf is empty", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      result.current.actions.updateField("nome", "Test");
      result.current.actions.updateField("cpf", "");
      result.current.actions.updateField("telefone", "11912345678");
      mockUseCase.createLead.mockRejectedValueOnce(
        new ValidationError("cpf", "CPF é obrigatório")
      );
      await result.current.actions.registerLead();
    });

    await waitFor(() => {
      expect(result.current.state.fieldErrors.cpf).toBe("CPF é obrigatório");
    });
  });

  test("should fail if cpf is invalid (length)", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      result.current.actions.updateField("nome", "Test");
      result.current.actions.updateField("cpf", "123");
      result.current.actions.updateField("telefone", "11912345678");
      mockUseCase.createLead.mockRejectedValueOnce(
        new ValidationError("cpf", "CPF deve ter 11 dígitos")
      );
      await result.current.actions.registerLead();
    });

    await waitFor(() => {
      expect(result.current.state.fieldErrors.cpf).toBe("CPF deve ter 11 dígitos");
    });
  });

  test("should handle repository error when registering lead", async () => {
    mockUseCase.createLead.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLeadRegisterViewModel());

    await act(async () => {
      result.current.actions.updateField("nome", "Test");
      result.current.actions.updateField("cpf", "12345678900");
      result.current.actions.updateField("telefone", "11912345678");
      await result.current.actions.registerLead();
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.state.error).toBe("Network error");
    });
  });
});
