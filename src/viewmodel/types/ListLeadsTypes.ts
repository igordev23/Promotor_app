import { Lead } from "@/src/model/entities/Lead";

/**
 * Estado da listagem de leads
 * Todos os campos são tipados explicitamente
 */
export interface IListLeadsState {
    readonly leads: ReadonlyArray<Lead>;
    readonly originalLeads: ReadonlyArray<Lead>;
    readonly error: string | null;
    readonly loading: boolean;
    readonly selectedLeads: ReadonlyArray<string>;
    readonly busca: string;
}

/**
 * Ações disponíveis na ViewModel
 * Todos os tipos de retorno são explícitos
 */
export interface IListLeadsActions {
    /**
     * Carrega todos os leads do repositório
     * @throws Error se falhar ao carregar
     */
    loadLeads(): Promise<void>;

    /**
     * Limpa a mensagem de erro
     */
    clearError(): void;

    /**
     * Filtra leads por query sem alterar originalLeads
     * @param query - Texto de busca
     */
    searchLeads(query: string): void;

    /**
     * Reseta o filtro para mostrar todos os leads
     */
    resetFilter(): void;

    /**
     * Remove um lead específico
     * @param id - ID do lead a remover
     * @throws Error se falhar na remoção
     */
    removeLead(id: string): Promise<void>;

    /**
     * Alterna seleção de um lead
     * @param id - ID do lead
     */
    toggleSelectLead(id: string): void;

    /**
     * Seleciona/desseleciona todos os leads
     */
    selectAll(): void;

    /**
     * Remove todos os leads selecionados
     * @throws Error se falhar em alguma remoção
     */
    removeSelected(): Promise<void>;

    /**
     * Atualiza a query de busca e filtra em tempo real
     * @param query - Texto de busca
     */
    updateSearchQuery(query: string): void;
}

/**
 * Retorno completo do hook useListLeadsViewModel
 */
export interface IListLeadsViewModelReturn {
    state: IListLeadsState;
    actions: IListLeadsActions;
}

/**
 * Tipo para remover lead com confirmação
 */
export type RemoveLeadHandler = (id: string) => void;

/**
 * Tipo para remover múltiplos leads com confirmação
 */
export type RemoveSelectedHandler = () => void;

/**
 * Tipo para editar lead
 */
export type EditLeadHandler = (lead: Lead) => void;

/**
 * Tipo para buscar lead
 */
export type SearchLeadHandler = (query: string) => void;
