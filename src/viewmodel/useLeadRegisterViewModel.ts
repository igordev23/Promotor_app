import { ILeadRepository } from "../model/repositories/ILeadRepository";
import { Lead } from "../model/entities/Lead";
import { useEffect, useState, useMemo } from "react";
import { LeadUseCase } from "../model/useCases/LeadUseCase";

export type LeadRegisterState = {
  leads: Lead[];
  error: string | null;
  loading: boolean;
};

export type LeadRegisterActions = {
  registerLead: (data: Omit<Lead, "id">) => Promise<void>;
  loadLeads: () => Promise<void>;
  clearError: () => void;
};

export const useLeadRegisterViewModel = (
  repository: ILeadRepository
): { state: LeadRegisterState; actions: LeadRegisterActions } => {
  const leadUseCase = useMemo(() => new LeadUseCase(repository), [repository]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await leadUseCase.getLeads();
      setLeads(all);
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err, "Erro ao carregar leads"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [repository]);

  const registerLead = async (data: Omit<Lead, "id">) => {
    setError(null);

    // validação
    if (!data.nome?.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!data.cpf?.trim()) {
      setError("CPF é obrigatório");
      return;
    }
    const cleanCpf = data.cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setError("CPF deve ter 11 dígitos");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Email inválido");
      return;
    }
    if (!data.telefone?.trim()) {
      setError("Telefone é obrigatório");
      return;
    }

    setLoading(true);
    try {
      const newLead = await leadUseCase.createLead(data);
      // atualiza estado local para UI refletir imediatamente
      setLeads((prev) => [...prev, newLead]);
    } catch (err: unknown) {
      setError(leadUseCase.parseError(err, "Erro ao cadastrar lead"));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    state: {
      leads,
      loading,
      error,
    },
    actions: {
      registerLead,
      loadLeads,
      clearError,
    },
  };
};