import { ILeadRepository } from "../model/repositories/ILeadRepository";
import { Lead } from "../model/entities/Lead";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const parseError = (err: unknown, fallback = "Ocorreu um erro"): string => {
    if (!err) return fallback;
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message || fallback;
    if (typeof err === "object" && err !== null && "message" in (err as any)) {
      const m = (err as any).message;
      return typeof m === "string" ? m : fallback;
    }
    try {
      return JSON.stringify(err) || fallback;
    } catch {
      return fallback;
    }
  };

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await repository.getAll();
      setLeads(all);
    } catch (err: unknown) {
      setError(parseError(err, "Erro ao carregar leads"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [repository]);

  const registerLead = async (data: Omit<Lead, "id">) => {
    setError(null);

    // validação antes de mostrar loading
    if (
      !data.nome?.trim() ||
      !data.email?.trim() ||
      !data.cpf?.trim() ||
      !data.telefone?.trim()
    ) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const newLead = await repository.create(data);
      // atualiza estado local para UI refletir imediatamente
      setLeads((prev) => [...prev, newLead]);
    } catch (err: unknown) {
      setError(parseError(err, "Erro ao cadastrar lead"));
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