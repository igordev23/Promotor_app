import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { useCallback, useEffect, useState } from "react";

export type LeadRegisterState = {
  leads: Lead[];
  error: string | null;
  loading: boolean;
};

export type LeadRegisterActions = {
  registerLead: (data: Omit<Lead, "id">) => Promise<void>;
  loadLeads: () => Promise<void>;
  clearError: () => void;
};

export const useLeadRegisterViewModel = (): {
  state: LeadRegisterState;
  actions: LeadRegisterActions;
} => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await leadUseCase.getLeads();
      setLeads(all);
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err, "Erro ao carregar leads"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const registerLead = useCallback(
    async (data: Omit<Lead, "id">) => {
      setError(null);
      setLoading(true);
      try {
        const newLead = await leadUseCase.createLead(data);
        setLeads((prev) => [...prev, newLead]);
      } catch (err: unknown) {
        setError(leadUseCase.parseError(err, "Erro ao cadastrar lead"));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeLead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await leadUseCase.deleteLead(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err) {
      setError("Erro ao remover lead");
    } finally {
      setLoading(false);
    }
  }, []);


  const clearError = useCallback(() => setError(null), []);

  return {
    state: {
      leads,
      loading,
      error,
    },
    actions: {
      registerLead,
      loadLeads,
      clearError,
      removeLead,
    },
  };
};
