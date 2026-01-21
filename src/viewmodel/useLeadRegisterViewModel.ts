import { useCallback, useState } from "react";
import { leadUseCase } from "../useCases/LeadUseCase";
import { Lead } from "../model/entities/Lead";
import { formatCPF, formatPhone } from "../utils/formatters";

import { ValidationError } from "../errors/ValidationError";

export type LeadRegisterState = {
  loading: boolean;
  error: string | null;
  fieldErrors: {
    nome?: string;
    cpf?: string;
    telefone?: string;
  };
  lead: Omit<Lead, "id">;
};

export type LeadRegisterActions = {
  registerLead: () => Promise<void>;
  updateField: (field: keyof Omit<Lead, "id">, value: string) => void;
  clearError: () => void;
};

export const useLeadRegisterViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] =
    useState<LeadRegisterState["fieldErrors"]>({});

  const [lead, setLead] = useState<Omit<Lead, "id">>({
    nome: "",
    cpf: "",
    telefone: "",
  });

  const clearSuccess = useCallback(() => {
  setSuccess(false);
}, []);

  const updateField = useCallback(
  (field: keyof Omit<Lead, "id">, value: string) => {
    setSuccess(false);

    setLead((prev) => {
      if (field === "cpf") {
        return {
          ...prev,
          cpf: formatCPF(value),
        };
      }

      if (field === "telefone") {
        return {
          ...prev,
          telefone: formatPhone(value),
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  },
  []
);

  // 🔹 Registrar Lead (validação acontece NO USE CASE)
  const registerLead = useCallback(async () => {
  setLoading(true);
  setError(null);
  setFieldErrors({});
  setSuccess(false);

  try {
    await leadUseCase.createLead(lead);

    setLead({
      nome: "",
      cpf: "",
      telefone: "",
    });

    setSuccess(true); // ✅ sucesso explícito
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      setFieldErrors({
        [err.field]: err.message,
      });
      return;
    }

    const message = leadUseCase.parseError(err, "Erro ao cadastrar lead");
    setError(message);
  } finally {
    setLoading(false);
  }
}, [lead]);
  const [success, setSuccess] = useState(false);



  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  return {
    state: {
      loading,
      error,
      fieldErrors,
      lead,
      success,
      },
    actions: {
      registerLead,
      updateField,
      clearError,
      clearSuccess,
    },
  };
};
