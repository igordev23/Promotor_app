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

    // ✅ Adicionado para feedback
    readonly successMessage: string | null;
}


/**
 * Ações disponíveis na ViewModel
 * Todos os tipos de retorno são explícitos
 */
export interface IListLeadsActions {
    loadLeads(): Promise<void>;
    clearError(): void;
    searchLeads(query: string): void;
    resetFilter(): void;
    removeLead(id: string): Promise<void>;
    toggleSelectLead(id: string): void;
    selectAll(): void;
    removeSelected(): Promise<void>;
    updateSearchQuery(query: string): void;

    // ✅ Adicionado para limpar feedback
    clearSuccessMessage(): void;
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
