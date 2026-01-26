import { useState } from "react";
import { RecoverPasswordUseCase } from "../useCases/RecoverPasswordUseCase";
import { authService } from "../model/services/AuthService";

type RecoverPasswordState = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

type RecoverPasswordActions = {
  recoverPassword(email: string): Promise<void>;
};

type UseRecoverPasswordViewModel = {
  state: RecoverPasswordState;
  actions: RecoverPasswordActions;
};


export function useRecoverPasswordViewModel(
  recoverPasswordUseCase: RecoverPasswordUseCase = new RecoverPasswordUseCase(authService)
): UseRecoverPasswordViewModel {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const recoverPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await recoverPasswordUseCase.execute(email);
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
      recoverPassword,
    },
  };
}
