import { useCallback, useState } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";

export type LeadRegisterState = {
  loading: boolean;
  error: string | null;
};

export type LeadRegisterActions = {
  registerLead: (data: Omit<Lead, "id">) => Promise<void>;
  clearError: () => void;
};

export const useLeadRegisterViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerLead = useCallback(
  async (data: Omit<Lead, "id">) => {
    setLoading(true);
    setError(null);

    try {
      await leadUseCase.createLead(data);
    } catch (err: unknown) {
      const message = leadUseCase.parseError(
        err,
        "Erro ao cadastrar lead"
      );
      setError(message);
      throw new Error(message); // 🔥 REPASSA O ERRO
    } finally {
      setLoading(false);
    }
  },
  []
);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    state: {
      loading,
      error,
    },
    actions: {
      registerLead,
      clearError,
    },
  };
};
