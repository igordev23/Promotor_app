import { useCallback, useState } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";

export type LeadRegisterState = {
  loading: boolean;
  error: string | null;
};

export type LeadRegisterActions = {
  registerLead: (data: Partial<Lead>) => Promise<void>;
  clearError: () => void;
};

export const useLeadEditViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerLead = useCallback(async (data: Partial<Lead>) => {
    setLoading(true);
    setError(null);

    try {
      if (data.id) {
        await leadUseCase.editLead(data.id, {
          nome: data.nome!,
          cpf: data.cpf!,
          telefone: data.telefone!,
        });
      } else {
        await leadUseCase.createLead({
          nome: data.nome!,
          cpf: data.cpf!,
          telefone: data.telefone!,
        });
      }
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err, "Erro ao salvar lead"));
    } finally {
      setLoading(false);
    }
  }, []);

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
