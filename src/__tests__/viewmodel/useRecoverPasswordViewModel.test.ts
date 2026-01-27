import { renderHook, act } from "@testing-library/react";
import { useRecoverPasswordViewModel } from "../../viewmodel/useRecoverPasswordViewModel";
import { RecoverPasswordUseCase } from "../../useCases/RecoverPasswordUseCase";

jest.mock("../../useCases/RecoverPasswordUseCase");

describe("useRecoverPasswordViewModel", () => {
  const executeMock = jest.fn();

  beforeEach(() => {
    (RecoverPasswordUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));
  });

  it("deve iniciar com estado padrão", () => {
    const { result } = renderHook(() => useRecoverPasswordViewModel());

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.success).toBe(false);
  });

  it("deve chamar o use case e marcar sucesso", async () => {
    executeMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRecoverPasswordViewModel());

    await act(async () => {
      await result.current.actions.recoverPassword("teste@email.com");
    });

    expect(result.current.state.success).toBe(true);
    expect(result.current.state.error).toBeNull();
  });

  it("deve capturar erro do use case", async () => {
    executeMock.mockRejectedValueOnce(new Error("E-mail inválido"));

    const { result } = renderHook(() => useRecoverPasswordViewModel());

    await act(async () => {
      await result.current.actions.recoverPassword("email_ruim");
    });

    expect(result.current.state.error).toBe("E-mail inválido");
    expect(result.current.state.success).toBe(false);
  });
});