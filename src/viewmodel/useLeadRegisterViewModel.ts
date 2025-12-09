import { ILeadRepository } from "../model/repositories/ILeadRepository";
import { Lead } from "../model/entities/Lead";
import { useEffect, useState, useMemo } from "react";
import { LeadUseCase } from "../../useCases/LeadUseCase";

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

export const useLeadRegisterViewModel = (
  repository: ILeadRepository
): { state: LeadRegisterState; actions: LeadRegisterActions } => {
  const leadUseCase = useMemo(() => new LeadUseCase(repository), [repository]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = async () => {
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
  };

  useEffect(() => {
    loadLeads();
  }, [repository]);

  const registerLead = async (data: Omit<Lead, "id">) => {
    setError(null);
    setLoading(true);

    try {
      const newLead = await leadUseCase.createLead(data);
      // atualiza estado local para UI refletir imediatamente
      setLeads((prev) => [...prev, newLead]);
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err, "Erro ao cadastrar lead"));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

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
    },
  };
};