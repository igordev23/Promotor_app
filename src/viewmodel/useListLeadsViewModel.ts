import { LeadUseCase } from "../../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { useState, useMemo } from "react";
import { ILeadRepository } from "../model/repositories/ILeadRepository";

export type ListLeadsState = {
  leads: Lead[];
  originalLeads: Lead[];
  error: string | null;
  loading: boolean;
};

export type ListLeadsActions = {
  loadLeads: () => Promise<void>;
  clearError: () => void;
  searchLeads: (query: string) => void;
  resetFilter: () => void;
};

export const useListLeadsViewModel = (repository: ILeadRepository) => {
  const leadUseCase = useMemo(() => new LeadUseCase(repository), [repository]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [originalLeads, setOriginalLeads] = useState<Lead[]>([]);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await leadUseCase.getLeads();
      setOriginalLeads(result);
      setLeads(result);
    } catch (err) {
      setError(leadUseCase.parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const searchLeads = (query: string) => {
    const filtered = leadUseCase.filterLeads(originalLeads, query);
    setLeads(filtered);
  };

  const resetFilter = () => {
    setLeads(originalLeads);
  };

  return {
    state: {
      leads,
      originalLeads,
      error,
      loading,
    },
    actions: {
      loadLeads,
      clearError,
      searchLeads,
      resetFilter,
    },
  };
};
