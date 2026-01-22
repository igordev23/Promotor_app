// src/viewmodel/useLeadEditViewModel.ts
import { useCallback, useState, useMemo } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { 
  formatCPF, 
  formatPhone, 
  onlyDigits, 
  isValidCPF, 
  isValidPhone 
} from "../utils/formatters";

// Tipos
export interface LeadEditState {
  loading: boolean;
  error: string | null;
  success: boolean;
  fieldErrors: FieldErrors;
}

export interface FieldErrors {
  nome?: string;
  cpf?: string;
  telefone?: string;
}

export interface LeadEditActions {
  editLead: (data: LeadEditData) => Promise<void>;
  updateField: (field: keyof LeadEditData, value: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
  clearFieldErrors: () => void;
  resetState: () => void;
}

export interface LeadEditData {
  id: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
}

export interface LeadEditViewModel {
  state: LeadEditState;
  actions: LeadEditActions;
}

// Constantes
const ERROR_MESSAGES = {
  DEFAULT: "Erro ao atualizar lead",
  VALIDATION: "Dados inválidos para atualização",
  NETWORK: "Erro de conexão. Verifique sua internet.",
  ID_REQUIRED: "ID do lead é obrigatório",
  NOME_REQUIRED: "Nome é obrigatório",
  CPF_INVALID: "CPF inválido (deve conter 11 dígitos)",
  TELEFONE_INVALID: "Telefone inválido (deve conter 10 ou 11 dígitos)",
} as const;

// Estado inicial
const initialState: LeadEditState = {
  loading: false,
  error: null,
  success: false,
  fieldErrors: {},
};

// Hook principal
export const useLeadEditViewModel = (): LeadEditViewModel => {
  const [state, setState] = useState<LeadEditState>(initialState);
  const [formData, setFormData] = useState<Omit<LeadEditData, 'id'>>({
    nome: "",
    cpf: "",
    telefone: "",
  });

  // Limpa erros gerais
  const clearError = useCallback((): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Limpa erros de campo
  const clearFieldErrors = useCallback((): void => {
    setState(prev => ({
      ...prev,
      fieldErrors: {},
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
    setFormData({
      nome: "",
      cpf: "",
      telefone: "",
    });
  }, []);

  // Atualiza campo do formulário com formatação automática
  const updateField = useCallback((field: keyof LeadEditData, value: string): void => {
    setFormData(prev => {
      let formattedValue = value;
      
      // Aplica formatação automática
      if (field === 'cpf') {
        formattedValue = formatCPF(value);
      } else if (field === 'telefone') {
        formattedValue = formatPhone(value);
      }
      
      return {
        ...prev,
        [field]: formattedValue,
      };
    });

    // Limpa erro específico do campo
    setState(prev => ({
      ...prev,
      fieldErrors: {
        ...prev.fieldErrors,
        [field]: undefined,
      },
    }));
  }, []);

  // Inicializa dados do formulário
  const initializeFormData = useCallback((data: Partial<LeadEditData>): void => {
    const initialData: Omit<LeadEditData, 'id'> = {
      nome: data.nome ? String(data.nome) : "",
      cpf: data.cpf ? formatCPF(String(data.cpf)) : "",
      telefone: data.telefone ? formatPhone(String(data.telefone)) : "",
    };
    
    setFormData(initialData);
  }, []);

  // Valida dados antes de enviar
  const validateLeadData = useCallback((data: LeadEditData): FieldErrors => {
    const errors: FieldErrors = {};

    if (!data.id || data.id.trim() === "") {
      throw new Error(ERROR_MESSAGES.ID_REQUIRED);
    }

    if (data.nome !== undefined && data.nome.trim() === "") {
      errors.nome = ERROR_MESSAGES.NOME_REQUIRED;
    }

    if (data.cpf !== undefined && data.cpf !== "") {
      const cpfDigits = onlyDigits(data.cpf);
      if (!isValidCPF(cpfDigits)) {
        errors.cpf = ERROR_MESSAGES.CPF_INVALID;
      }
    }

    if (data.telefone !== undefined && data.telefone !== "") {
      const phoneDigits = onlyDigits(data.telefone);
      if (!isValidPhone(phoneDigits)) {
        errors.telefone = ERROR_MESSAGES.TELEFONE_INVALID;
      }
    }

    return errors;
  }, []);

  // Atualiza lead
  const editLead = useCallback(async (data: LeadEditData): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
      fieldErrors: {},
    }));

    try {
      // Validação
      const fieldErrors = validateLeadData(data);
      
      if (Object.keys(fieldErrors).length > 0) {
        setState(prev => ({
          ...prev,
          fieldErrors,
          loading: false,
        }));
        return;
      }

      // Prepara dados para envio (remove formatação)
      const leadData: Partial<Lead> = {
        ...(data.nome !== undefined && { nome: data.nome.trim() }),
        ...(data.cpf !== undefined && { cpf: onlyDigits(data.cpf) }),
        ...(data.telefone !== undefined && { 
          telefone: onlyDigits(data.telefone) 
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
        errorMessage.toLowerCase().includes("conexão") ||
        errorMessage.toLowerCase().includes("fetch");

      // Tenta identificar erros de campo específicos
      const fieldErrors: FieldErrors = {};
      const errorLower = errorMessage.toLowerCase();
      
      if (errorLower.includes("nome")) {
        fieldErrors.nome = errorMessage;
      } else if (errorLower.includes("cpf")) {
        fieldErrors.cpf = errorMessage;
      } else if (errorLower.includes("telefone") || errorLower.includes("phone")) {
        fieldErrors.telefone = errorMessage;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: Object.keys(fieldErrors).length === 0 
          ? (isNetworkError ? ERROR_MESSAGES.NETWORK : errorMessage)
          : null,
        fieldErrors,
        success: false,
      }));

      // Re-lança o erro apenas se não for erro de validação de campo
      if (Object.keys(fieldErrors).length === 0) {
        throw error;
      }
    }
  }, [validateLeadData]);

  // Memoiza as ações
  const actions: LeadEditActions = useMemo(() => ({
    editLead,
    updateField,
    clearError,
    clearSuccess,
    clearFieldErrors,
    resetState,
  }), [editLead, updateField, clearError, clearSuccess, clearFieldErrors, resetState]);

  return {
    state: {
      ...state,
    },
    actions,
  };
};

// Hook auxiliar para gerenciar formulário de edição
export const useLeadEditForm = (initialData?: Partial<LeadEditData>) => {
  const { state, actions } = useLeadEditViewModel();
  const [localFormData, setLocalFormData] = useState<Omit<LeadEditData, 'id'>>({
    nome: initialData?.nome || "",
    cpf: initialData?.cpf || "",
    telefone: initialData?.telefone || "",
  });

  // Inicializa com formatação
  const initializeWithFormatting = useCallback((data: Partial<LeadEditData>): void => {
    setLocalFormData({
      nome: data.nome || "",
      cpf: data.cpf ? formatCPF(String(data.cpf)) : "",
      telefone: data.telefone ? formatPhone(String(data.telefone)) : "",
    });
  }, []);

  // Handler para atualizar campo
  const handleFieldChange = useCallback((field: keyof LeadEditData, value: string): void => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setLocalFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));
    
    // Chama o updateField do view model
    actions.updateField(field, formattedValue);
  }, [actions]);

  return {
    formData: localFormData,
    handleFieldChange,
    initializeWithFormatting,
    ...state,
    ...actions,
  };
};