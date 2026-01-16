import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { useCallback, useState } from "react";

export type LeadRegisterState = {
  loading: boolean;
  error: string | null;
};

export type LeadRegisterActions = {
  registerLead: (data: Omit<Lead, "id">) => Promise<Lead>;
  clearError: () => string | null;
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
        setError(leadUseCase.parseError(err, "Erro ao cadastrar lead"));
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
