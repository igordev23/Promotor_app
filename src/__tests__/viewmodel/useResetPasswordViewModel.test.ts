import { renderHook, act } from "@testing-library/react-hooks";
import { useResetPasswordViewModel } from "../../viewmodel/useResetPasswordViewModel";
import { ResetPasswordUseCase } from "../../useCases/resetPasswordUseCase";



describe("useResetPasswordViewModel", () => {
  const executeMock = jest.fn();

  const makeUseCaseMock = () =>
    ({
      execute: executeMock,
    } as unknown as ResetPasswordUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve iniciar com estado padrão", () => {
    const useCaseMock = makeUseCaseMock();

    const { result } = renderHook(() =>
      useResetPasswordViewModel(useCaseMock)
    );

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.success).toBe(false);
  });

  it("deve chamar o use case e marcar sucesso", async () => {
    executeMock.mockResolvedValueOnce(undefined);

    const useCaseMock = makeUseCaseMock();

    const { result } = renderHook(() =>
      useResetPasswordViewModel(useCaseMock)
    );

    await act(async () => {
      await result.current.actions.resetPassword(
        "senha123",
        "senha123"
      );
    });

    expect(executeMock).toHaveBeenCalledWith(
      "senha123",
      "senha123"
    );
    expect(result.current.state.success).toBe(true);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.loading).toBe(false);
  });

  it("deve capturar erro do use case", async () => {
    executeMock.mockRejectedValueOnce(
      new Error("Senha inválida")
    );

    const useCaseMock = makeUseCaseMock();

    const { result } = renderHook(() =>
      useResetPasswordViewModel(useCaseMock)
    );

    await act(async () => {
      await result.current.actions.resetPassword(
        "123",
        "456"
      );
    });

    expect(result.current.state.error).toBe("Senha inválida");
    expect(result.current.state.success).toBe(false);
    expect(result.current.state.loading).toBe(false);
  });
});
