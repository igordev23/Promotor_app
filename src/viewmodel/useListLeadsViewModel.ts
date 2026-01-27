import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { useCallback, useState } from "react";
import {
  IListLeadsState,
  IListLeadsActions,
  IListLeadsViewModelReturn,
} from "./types/ListLeadsTypes";

/**
 * Hook MVVM para listagem de leads
 */
export const useListLeadsViewModel = (): IListLeadsViewModelReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<ReadonlyArray<Lead>>([]);
  const [originalLeads, setOriginalLeads] = useState<ReadonlyArray<Lead>>([]);
  const [selectedLeads, setSelectedLeads] = useState<ReadonlyArray<string>>([]);
  const [busca, setBusca] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Carrega todos os leads
   */
  const loadLeads = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await leadUseCase.getLeads();
      setOriginalLeads(Object.freeze([...result]));
      setLeads(Object.freeze([...result]));
      setSelectedLeads(Object.freeze([]));
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Atualiza a query de busca
   */
  const updateSearchQuery = useCallback(
    (query: string) => {
      setBusca(query);
      const filtered = query
        ? leadUseCase.filterLeads(Array.from(originalLeads), query)
        : Array.from(originalLeads);
      setLeads(Object.freeze(filtered));
    },
    [originalLeads]
  );

  /**
   * Filtra leads por query sem alterar originalLeads
   */
  const searchLeads = useCallback(
    (query: string) => {
      const filtered = query
        ? leadUseCase.filterLeads(Array.from(originalLeads), query)
        : Array.from(originalLeads);
      setLeads(Object.freeze(filtered));
    },
    [originalLeads]
  );

  /**
   * Reseta o filtro
   */
  const resetFilter = useCallback(() => {
    setLeads(Object.freeze([...originalLeads]));
    setBusca("");
  }, [originalLeads]);

  /**
   * Alterna seleção de um lead
   */
  const toggleSelectLead = useCallback((id: string) => {
    setSelectedLeads((prev) => {
      const prevArray = Array.from(prev);
      return prevArray.includes(id)
        ? Object.freeze(prevArray.filter((x) => x !== id))
        : Object.freeze([...prevArray, id]);
    });
  }, []);

  /**
   * Seleciona ou desseleciona todos
   */
  const selectAll = useCallback(() => {
    const allIds = leads.map((l) => l.id);
    setSelectedLeads((prev) =>
      prev.length === leads.length ? Object.freeze([]) : Object.freeze(allIds)
    );
  }, [leads]);

  /**
   * Remove lead específico
   */
  const removeLead = useCallback(async (id: string) => {
    setError(null);
    try {
      await leadUseCase.removeLead(id);
      setLeads((prev) => Object.freeze(prev.filter((l) => l.id !== id)));
      setOriginalLeads((prev) => Object.freeze(prev.filter((l) => l.id !== id)));
      setSelectedLeads((prev) => Object.freeze(prev.filter((x) => x !== id)));
      setSuccessMessage("Lead excluído com sucesso!");
    } catch (err: unknown) {
      const msg = leadUseCase.parseError(err);
      setError(msg);
      throw err;
    }
  }, []);

  /**
   * Remove todos os selecionados
   */
  const removeSelected = useCallback(async () => {
    if (!selectedLeads.length) throw new Error("Nenhum lead selecionado");
    try {
      await Promise.all(selectedLeads.map((id) => leadUseCase.removeLead(id)));
      setLeads((prev) => Object.freeze(prev.filter((l) => !selectedLeads.includes(l.id))));
      setOriginalLeads((prev) => Object.freeze(prev.filter((l) => !selectedLeads.includes(l.id))));
      setSelectedLeads(Object.freeze([]));
      setSuccessMessage(`${selectedLeads.length} leads excluídos com sucesso!`);
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err));
      throw err;
    }
  }, [selectedLeads]);

  /**
   * Limpa mensagem de sucesso
   */
  const clearSuccessMessage = useCallback(() => setSuccessMessage(null), []);

  /**
   * Estado
   */
  const state: IListLeadsState = {
    leads: Object.freeze([...leads]),
    originalLeads: Object.freeze([...originalLeads]),
    error,
    loading,
    selectedLeads: Object.freeze([...selectedLeads]),
    busca,
    successMessage,
  };

  /**
   * Ações
   */
  const actions: IListLeadsActions = {
    loadLeads,
    clearError,
    searchLeads,
    resetFilter,
    updateSearchQuery,
    toggleSelectLead,
    selectAll,
    removeLead,
    removeSelected,
    clearSuccessMessage,
  };

  return { state, actions };
};
