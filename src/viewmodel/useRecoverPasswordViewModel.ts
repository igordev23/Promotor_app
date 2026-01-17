import { useState } from "react";
import { RecoverPasswordUseCase } from "../useCases/RecoverPasswordUseCase";
import { authService } from "../model/services/AuthService";

export function useRecoverPasswordViewModel(
  recoverPasswordUseCase = new RecoverPasswordUseCase(authService)
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const recoverPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await recoverPasswordUseCase.execute(email);
      setSuccess(true);
    } catch (err) {
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
