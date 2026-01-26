import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { useCallback, useState, FC } from "react";
import {
  IListLeadsState,
  IListLeadsActions,
  IListLeadsViewModelReturn,
} from "./types/ListLeadsTypes";

/**
 * Hook para gerenciar estado e lógica de listagem de leads
 * Implementa padrão MVVM com tipagem forte
 * @returns {IListLeadsViewModelReturn} Estado e ações para o componente
 */
export const useListLeadsViewModel = (): IListLeadsViewModelReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<ReadonlyArray<Lead>>([]);
  const [originalLeads, setOriginalLeads] = useState<ReadonlyArray<Lead>>([]);
  const [selectedLeads, setSelectedLeads] = useState<ReadonlyArray<string>>([]);
  const [busca, setBusca] = useState<string>("");

  /**
   * Carrega todos os leads do repositório
   */
  const loadLeads = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result: Lead[] = await leadUseCase.getLeads();
      setOriginalLeads(Object.freeze([...result]));
      setLeads(Object.freeze([...result]));
      setSelectedLeads(Object.freeze([]));
    } catch (err: unknown) {
      const errorMessage: string = leadUseCase.parseError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpa a mensagem de erro
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  /**
   * Filtra leads por query
   */
  const searchLeads = useCallback(
    (query: string): void => {
      const filtered: Lead[] = leadUseCase.filterLeads(
        Array.from(originalLeads),
        query
      );
      setLeads(Object.freeze([...filtered]));
    },
    [originalLeads]
  );

  /**
   * Reseta o filtro
   */
  const resetFilter = useCallback((): void => {
    setLeads(Object.freeze([...originalLeads]));
  }, [originalLeads]);

  /**
   * Remove um lead específico
   */
  const removeLead = useCallback(
    async (id: string): Promise<void> => {
      if (!id || typeof id !== "string") {
        throw new Error("ID do lead é inválido");
      }

      setError(null);

      try {
        await leadUseCase.removeLead(id);

        const updatedLeads: Lead[] = Array.from(leads).filter(
          (lead: Lead) => lead.id !== id
        );
        setLeads(Object.freeze([...updatedLeads]));

        const updatedOriginal: Lead[] = Array.from(originalLeads).filter(
          (lead: Lead) => lead.id !== id
        );
        setOriginalLeads(Object.freeze([...updatedOriginal]));

        const updatedSelected: string[] = Array.from(selectedLeads).filter(
          (leadId: string) => leadId !== id
        );
        setSelectedLeads(Object.freeze([...updatedSelected]));
      } catch (err: unknown) {
        const errorMessage: string = leadUseCase.parseError(err);
        setError(errorMessage);
        throw err;
      }
    },
    [leads, originalLeads, selectedLeads]
  );

  /**
   * Alterna seleção de um lead
   */
  const toggleSelectLead = useCallback((id: string): void => {
    if (!id || typeof id !== "string") {
      throw new Error("ID do lead é inválido");
    }

    setSelectedLeads((prev: ReadonlyArray<string>) => {
      const prevArray: string[] = Array.from(prev);
      const isSelected: boolean = prevArray.includes(id);
      const updated: string[] = isSelected
        ? prevArray.filter((leadId: string) => leadId !== id)
        : [...prevArray, id];
      return Object.freeze(updated);
    });
  }, []);

  /**
   * Seleciona ou desseleciona todos os leads
   */
  const selectAll = useCallback((): void => {
    setSelectedLeads((prev: ReadonlyArray<string>): ReadonlyArray<string> => {
      const prevArray: string[] = Array.from(prev);
      const leadsArray: Lead[] = Array.from(leads);
      const allIds: string[] = leadsArray.map((lead: Lead) => lead.id);

      const isAllSelected: boolean = prevArray.length === leadsArray.length;
      const updated: string[] = isAllSelected ? [] : allIds;
      return Object.freeze(updated);
    });
  }, [leads]);

  /**
   * Remove todos os leads selecionados
   */
  const removeSelected = useCallback(async (): Promise<void> => {
    const selectedArray: string[] = Array.from(selectedLeads);

    if (selectedArray.length === 0) {
      throw new Error("Nenhum lead selecionado");
    }

    try {
      const removalPromises: Promise<void | number>[] = selectedArray.map(
        (id: string) => leadUseCase.removeLead(id)
      );
      await Promise.all(removalPromises);

      const updatedLeads: Lead[] = Array.from(leads).filter(
        (lead: Lead) => !selectedArray.includes(lead.id)
      );
      setLeads(Object.freeze([...updatedLeads]));

      const updatedOriginal: Lead[] = Array.from(originalLeads).filter(
        (lead: Lead) => !selectedArray.includes(lead.id)
      );
      setOriginalLeads(Object.freeze([...updatedOriginal]));

      setSelectedLeads(Object.freeze([]));
    } catch (err: unknown) {
      const errorMessage: string = leadUseCase.parseError(err);
      setError(errorMessage);
      throw err;
    }
  }, [selectedLeads, leads, originalLeads]);

  /**
   * Atualiza a query de busca e filtra em tempo real
   */
  const updateSearchQuery = useCallback((query: string): void => {
    if (typeof query !== "string") {
      throw new Error("Query deve ser uma string");
    }

    setBusca(query);

    if (!query.trim()) {
      setLeads(Object.freeze([...originalLeads]));
    } else {
      const filtered: Lead[] = leadUseCase.filterLeads(
        Array.from(originalLeads),
        query
      );
      setLeads(Object.freeze([...filtered]));
    }
  }, [originalLeads]);

  /**
   * Estado da ViewModel
   */
  const state: IListLeadsState = {
    leads: Object.freeze([...leads]),
    originalLeads: Object.freeze([...originalLeads]),
    error,
    loading,
    selectedLeads: Object.freeze([...selectedLeads]),
    busca,
  };

  /**
   * Ações da ViewModel
   */
  const actions: IListLeadsActions = {
    loadLeads,
    clearError,
    searchLeads,
    resetFilter,
    removeLead,
    toggleSelectLead,
    selectAll,
    removeSelected,
    updateSearchQuery,
  };

  return { state, actions };
};
