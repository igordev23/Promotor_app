import { renderHook, act } from "@testing-library/react";
import { useLeadEditViewModel } from "../../viewmodel/useLeadEditViewModel";
import { leadUseCase } from "../../useCases/LeadUseCase";

/* =========================
   MOCKS
========================= */

jest.mock("../../useCases/LeadUseCase", () => ({
  leadUseCase: {
    editLead: jest.fn(),
    parseError: jest.fn(),
  },
}));

/* =========================
   TESTES
========================= */

describe("useLeadEditViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty state when no initialParams", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    expect(result.current.state).toEqual({
      loading: false,
      success: false,
      nome: "",
      cpf: "",
      telefone: "",
      errors: {},
    });
  });

  it("should initialize with initialParams", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1", {
        nome: "João",
        cpf: "12345678900",
        telefone: "11999999999",
      })
    );

    expect(result.current.state.nome).toBe("João");
    expect(result.current.state.cpf).toContain("123");
    expect(result.current.state.telefone).toContain("11");
  });

  it("should initialize fields using initialize()", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    act(() => {
      result.current.actions.initialize({
        nome: "Maria",
        cpf: "98765432100",
        telefone: "21988888888",
      });
    });

    expect(result.current.state.nome).toBe("Maria");
    expect(result.current.state.cpf).toContain("987");
    expect(result.current.state.telefone).toContain("21");
  });

  it("should update nome and clear nome error", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    act(() => {
      result.current.actions.setNome("Carlos");
    });

    expect(result.current.state.nome).toBe("Carlos");
    expect(result.current.state.errors.nome).toBeUndefined();
  });

  it("should update cpf formatted and clear cpf error", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    act(() => {
      result.current.actions.setCpf("12345678900");
    });

    expect(result.current.state.cpf).toContain("123");
    expect(result.current.state.errors.cpf).toBeUndefined();
  });

  it("should update telefone formatted and clear telefone error", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    act(() => {
      result.current.actions.setTelefone("11999999999");
    });

    expect(result.current.state.telefone).toContain("11");
    expect(result.current.state.errors.telefone).toBeUndefined();
  });

  it("should clear specific field error", () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    act(() => {
      result.current.actions.clearFieldError("nome");
    });

    expect(result.current.state.errors.nome).toBeUndefined();
  });

  it("should set error when id is not provided", async () => {
    const { result } = renderHook(() =>
      useLeadEditViewModel(undefined)
    );

    await act(async () => {
      await result.current.actions.editLead();
    });

    expect(result.current.state.errors.nome).toBe(
      "ID do lead não informado"
    );
  });

  it("should edit lead successfully", async () => {
    (leadUseCase.editLead as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useLeadEditViewModel("1", {
        nome: "Ana",
        cpf: "12345678900",
        telefone: "11999999999",
      }, onSuccess)
    );

    await act(async () => {
      await result.current.actions.editLead();
    });

    expect(leadUseCase.editLead).toHaveBeenCalledWith("1", {
      nome: "Ana",
      cpf: "12345678900",
      telefone: "11999999999",
    });

    expect(result.current.state.success).toBe(true);
    expect(result.current.state.loading).toBe(false);
    expect(onSuccess).toHaveBeenCalled();
  });

  it("should set field errors when editLead fails", async () => {
    (leadUseCase.editLead as jest.Mock).mockRejectedValueOnce(
      new Error("erro")
    );

    (leadUseCase.parseError as jest.Mock).mockReturnValueOnce(
      "CPF inválido"
    );

    const { result } = renderHook(() =>
      useLeadEditViewModel("1")
    );

    await act(async () => {
      await result.current.actions.editLead();
    });

    expect(result.current.state.errors.cpf).toBe("CPF inválido");
    expect(result.current.state.loading).toBe(false);
  });
});
