import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { useCallback, useState } from "react";

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

export const useListLeadsViewModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [originalLeads, setOriginalLeads] = useState<Lead[]>([]);

  const loadLeads = useCallback(async () => {
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
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const searchLeads = useCallback(
    (query: string) => {
      const filtered = leadUseCase.filterLeads(originalLeads, query);
      setLeads(filtered);
    },
    [originalLeads]
  );

  const resetFilter = useCallback(() => {
    setLeads(originalLeads);
  }, [originalLeads]);

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
