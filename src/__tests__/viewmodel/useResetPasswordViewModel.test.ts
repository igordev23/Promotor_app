import { renderHook, act } from "@testing-library/react";
import { useResetPasswordViewModel } from "../../viewmodel/useResetPasswordViewModel";
import { ResetPasswordUseCase } from "../../useCases/resetPasswordUseCase";

function makeUseCaseMock() {
  return {
    execute: jest.fn(),
  } as unknown as ResetPasswordUseCase;
}

describe("useResetPasswordViewModel", () => {
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
    const useCaseMock = makeUseCaseMock();
    useCaseMock.execute = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useResetPasswordViewModel(useCaseMock)
    );

    await act(async () => {
      await result.current.actions.resetPassword("123456", "123456");
    });

    expect(useCaseMock.execute).toHaveBeenCalledWith("123456", "123456");
    expect(result.current.state.success).toBe(true);
    expect(result.current.state.error).toBeNull();
  });

  it("deve capturar erro do use case", async () => {
    const useCaseMock = makeUseCaseMock();
    useCaseMock.execute = jest
      .fn()
      .mockRejectedValue(new Error("Erro qualquer"));

    const { result } = renderHook(() =>
      useResetPasswordViewModel(useCaseMock)
    );

    await act(async () => {
      await result.current.actions.resetPassword("123", "456");
    });

    expect(result.current.state.success).toBe(false);
    expect(result.current.state.error).toBe("Erro qualquer");
  });
});
