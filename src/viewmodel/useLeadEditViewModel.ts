// src/viewmodel/useLeadEditViewModel.ts
import { useCallback, useState, useMemo } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";

// Tipos
export interface LeadEditState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface LeadEditActions {
  editLead: (data: LeadEditData) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  resetState: () => void;
}

export interface LeadEditData extends Partial<Lead> {
  id: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
}

export interface LeadEditViewModel {
  state: LeadEditState;
  actions: LeadEditActions;
}

// Interface para erros
interface LeadEditError extends Error {
  code?: string;
  field?: keyof LeadEditData;
}

// Constantes
const ERROR_MESSAGES = {
  DEFAULT: "Erro ao atualizar lead",
  VALIDATION: "Dados inválidos para atualização",
  NETWORK: "Erro de conexão. Verifique sua internet.",
} as const;

const SUCCESS_MESSAGE = "Lead atualizado com sucesso!";

// Estado inicial
const initialState: LeadEditState = {
  loading: false,
  error: null,
  success: false,
};

// Hook principal
export const useLeadEditViewModel = (): LeadEditViewModel => {
  const [state, setState] = useState<LeadEditState>(initialState);

  // Limpa erros
  const clearError = useCallback((): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Limpa estado de sucesso
  const clearSuccess = useCallback((): void => {
    setState(prev => ({
      ...prev,
      success: false,
    }));
  }, []);

  // Reseta todo o estado
  const resetState = useCallback((): void => {
    setState(initialState);
  }, []);

  // Valida dados antes de enviar
  const validateLeadData = useCallback((data: LeadEditData): boolean => {
    if (!data.id || data.id.trim() === "") {
      throw new Error("ID do lead é obrigatório");
    }

    if (data.nome !== undefined && data.nome.trim() === "") {
      throw new Error("Nome não pode ser vazio");
    }

    if (data.cpf !== undefined && !/^\d{11}$/.test(data.cpf.replace(/\D/g, ""))) {
      throw new Error("CPF inválido");
    }

    if (data.telefone !== undefined) {
      const digits = data.telefone.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) {
        throw new Error("Telefone inválido");
      }
    }

    return true;
  }, []);

  // Atualiza lead
  const editLead = useCallback(async (data: LeadEditData): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      // Validação
      validateLeadData(data);

      // Prepara dados para envio
      const leadData: Partial<Lead> = {
        ...(data.nome !== undefined && { nome: data.nome.trim() }),
        ...(data.cpf !== undefined && { cpf: data.cpf.replace(/\D/g, "") }),
        ...(data.telefone !== undefined && {
          telefone: data.telefone.replace(/\D/g, "")
        }),
      };

      // Executa o caso de uso
      await leadUseCase.editLead(data.id, leadData);

      // Sucesso
      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
      }));

    } catch (error: unknown) {
      // Tratamento de erro
      const errorMessage = error instanceof Error
        ? error.message
        : leadUseCase.parseError?.(error, ERROR_MESSAGES.DEFAULT) || ERROR_MESSAGES.DEFAULT;

      const isNetworkError = errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("conexão");

      setState(prev => ({
        ...prev,
        loading: false,
        error: isNetworkError ? ERROR_MESSAGES.NETWORK : errorMessage,
        success: false,
      }));

      // Re-lança o erro para tratamento no componente
      throw error;
    }
  }, [validateLeadData]);

  // Memoiza as ações
  const actions: LeadEditActions = useMemo(() => ({
    editLead,
    clearError,
    clearSuccess,
    resetState,
  }), [editLead, clearError, clearSuccess, resetState]);

  return {
    state,
    actions,
  };
};

// Hook auxiliar para log de erros
export const useLeadEditErrorHandler = () => {
  const handleError = useCallback((error: unknown, field?: keyof LeadEditData): string => {
    if (error instanceof Error) {
      console.error(`Erro ao editar lead${field ? ` no campo ${field}` : ""}:`, error);

      // Mapeia erros comuns para mensagens amigáveis
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        return ERROR_MESSAGES.NETWORK;
      }

      if (errorMessage.includes("validation") || errorMessage.includes("invalid")) {
        return ERROR_MESSAGES.VALIDATION;
      }

      return error.message;
    }

    return ERROR_MESSAGES.DEFAULT;
  }, []);

  return { handleError };
};