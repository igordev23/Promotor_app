import { useCallback, useState } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { formatCPF, formatPhone } from "../utils/formatters";

export type FieldErrors = {
  nome?: string;
  cpf?: string;
  telefone?: string;
};

export type LeadEditState = {
  loading: boolean;
  success: boolean;
  nome: string;
  cpf: string;
  telefone: string;
  errors: FieldErrors;
};

export type LeadEditActions = {
  editLead: () => Promise<void>;
  setNome: (nome: string) => void;
  setCpf: (cpf: string) => void;
  setTelefone: (telefone: string) => void;
  initialize: (params: Partial<Lead>) => void;
  clearFieldError: (field: keyof FieldErrors) => void;
};

export const useLeadEditViewModel = (
  id?: string,
  initialParams?: Partial<Lead>,
  onSuccess?: () => void // callback chamado quando o lead é atualizado com sucesso
) => {
  // Inicializa estado com valores iniciais, se existirem
  const [state, setState] = useState<LeadEditState>(() => ({
    loading: false,
    success: false,
    nome: initialParams?.nome ? initialParams.nome : "",
    cpf: initialParams?.cpf ? formatCPF(initialParams.cpf) : "",
    telefone: initialParams?.telefone ? formatPhone(initialParams.telefone) : "",
    errors: {},
  }));

  // Inicializa campos manualmente
  const initialize = useCallback((params: Partial<Lead>) => {
    setState({
      nome: params.nome || "",
      cpf: params.cpf ? formatCPF(params.cpf) : "",
      telefone: params.telefone ? formatPhone(params.telefone) : "",
      errors: {},
      loading: false,
      success: false,
    });
  }, []);

  // Atualiza nome e limpa erro específico
  const setNome = useCallback((nome: string) => {
    setState((prev) => ({
      ...prev,
      nome,
      errors: { ...prev.errors, nome: undefined },
    }));
  }, []);

  // Atualiza CPF e limpa erro específico
  const setCpf = useCallback((cpf: string) => {
    setState((prev) => ({
      ...prev,
      cpf: formatCPF(cpf),
      errors: { ...prev.errors, cpf: undefined },
    }));
  }, []);

  // Atualiza telefone e limpa erro específico
  const setTelefone = useCallback((telefone: string) => {
    setState((prev) => ({
      ...prev,
      telefone: formatPhone(telefone),
      errors: { ...prev.errors, telefone: undefined },
    }));
  }, []);

  // Limpa erro de um campo específico
  const clearFieldError = useCallback((field: keyof FieldErrors) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  }, []);

  // Edita lead e trata erros
  const editLead = useCallback(async () => {
    if (!id) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, nome: "ID do lead não informado" },
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, errors: {} }));

    try {
      await leadUseCase.editLead(id, {
        nome: state.nome,
        cpf: state.cpf.replace(/\D/g, ""),
        telefone: state.telefone.replace(/\D/g, ""),
      });

      setState((prev) => ({ ...prev, success: true }));
      if (onSuccess) onSuccess(); // callback de sucesso
    } catch (err: any) {
      const message = leadUseCase.parseError(err, "Erro ao atualizar lead");
      const errors: FieldErrors = {};
      if (message.toLowerCase().includes("nome")) errors.nome = message;
      if (message.toLowerCase().includes("cpf")) errors.cpf = message;
      if (message.toLowerCase().includes("telefone")) errors.telefone = message;

      setState((prev) => ({ ...prev, errors }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [id, state.nome, state.cpf, state.telefone, onSuccess]);

  return {
    state,
    actions: {
      editLead,
      setNome,
      setCpf,
      setTelefone,
      initialize,
      clearFieldError,
    },
  };
};
