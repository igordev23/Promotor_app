import { useState } from "react";
import { ResetPasswordUseCase } from "../useCases/resetPasswordUseCase";
import { authService } from "../model/services/AuthService";

type ResetPasswordState = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

type ResetPasswordActions = {
  resetPassword: (password: string, confirmPassword: string) => Promise<void>;
};

type UseResetPasswordViewModel = {
  state: ResetPasswordState;
  actions: ResetPasswordActions;
};

export function useResetPasswordViewModel(
  resetPasswordUseCase: ResetPasswordUseCase = new ResetPasswordUseCase(authService)
): UseResetPasswordViewModel {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetPassword = async (
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resetPasswordUseCase.execute(password, confirmPassword);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      loading,
      error,
      success,
    },
    actions: {
      resetPassword,
    },
  };
}
