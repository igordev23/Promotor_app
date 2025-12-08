import { renderHook, act } from "@testing-library/react";
import { useLeadRegisterViewModel } from "../../viewmodel/useLeadRegisterViewModel";
import { LeadRepositoryMemory } from "../../model/repositories/memory/LeadRepositoryMemory";

describe("useLeadRegisterViewModel", () => {
  let repository: LeadRepositoryMemory;

  beforeEach(() => {
    repository = new LeadRepositoryMemory();
  });

  test("should register a valid lead", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel(repository));

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Valid Lead",
        cpf: "12345678900",
        email: "valid@test.com",
        telefone: "123456789",
        timeStamp: Date.now(),
      });
    });

    expect(result.current.state.error).toBeNull();
    const leads = await repository.getAll();
    expect(leads).toHaveLength(1);
    expect(leads[0].nome).toBe("Valid Lead");
  });

  test("should fail if name is empty", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel(repository));

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "",
        cpf: "12345678900",
        email: "valid@test.com",
        telefone: "123456789",
        timeStamp: Date.now(),
      });
    });

    expect(result.current.state.error).toBe("Nome é obrigatório");
    const leads = await repository.getAll();
    expect(leads).toHaveLength(0);
  });

  test("should fail if email is invalid", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel(repository));

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Valid Lead",
        cpf: "12345678900",
        email: "invalid-email",
        telefone: "123456789",
        timeStamp: Date.now(),
      });
    });

    expect(result.current.state.error).toBe("Email inválido");
  });

  test("should fail if cpf is invalid (length)", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel(repository));

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Valid Lead",
        cpf: "123",
        email: "valid@test.com",
        telefone: "123456789",
        timeStamp: Date.now(),
      });
    });

    expect(result.current.state.error).toBe("CPF deve ter 11 dígitos");
  });

    test("should fail if cpf is empty", async () => {
    const { result } = renderHook(() => useLeadRegisterViewModel(repository));

    await act(async () => {
      await result.current.actions.registerLead({
        nome: "Valid Lead",
        cpf: "",
        email: "valid@test.com",
        telefone: "123456789",
        timeStamp: Date.now(),
      });
    });

    expect(result.current.state.error).toBe("CPF é obrigatório");
  });
});
