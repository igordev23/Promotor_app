import { useCallback, useState } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";

export type LeadEditState = {
  loading: boolean;
  error: string | null;
};

export type LeadEditActions = {
  editLead: (data: Partial<Lead> & { id: string }) => Promise<void>;
  clearError: () => void;
};

export const useLeadEditViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editLead = useCallback(
  async (data: Partial<Lead> & { id: string }) => {
    setLoading(true);
    setError(null);

    try {
      await leadUseCase.editLead(data.id, {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
      });
    } catch (err: unknown) {
      const message = leadUseCase.parseError(err, "Erro ao atualizar lead");
      setError(message);
      throw new Error(message); // 🔥 ESSENCIAL
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
      editLead,
      clearError,
    },
  };
};
