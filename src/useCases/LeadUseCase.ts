import { ILeadRepository } from "../model/repositories/ILeadRepository";
import { Lead } from "../model/entities/Lead";
import { leadRepository } from "../model/repositories/leadRepository";
import { ValidationError } from "../errors/ValidationError";

export class LeadUseCase {
  constructor(private repository: ILeadRepository) { }

  async getLeads(): Promise<Lead[]> {
    return this.repository.getAll();
  }

 async createLead(lead: Omit<Lead, "id">): Promise<Lead> {
  this.validateLead(lead);

  const normalizedLead: Omit<Lead, "id"> = {
    ...lead,
    cpf: lead.cpf.replace(/\D/g, ""),
    telefone: lead.telefone.replace(/\D/g, ""),
  };

  return this.repository.create(normalizedLead);
}


  // feat: implementa removeLead no LeadUseCase para passar no teste (GREEN)
  // refactor: melhora validação no removeLead
  async removeLead(id: string): Promise<number | void> {
    if (!id) {
      throw new Error("ID do lead é obrigatório");
    }
    return this.repository.delete(id);
  }

  // feat: implementa editLead no LeadUseCase para passar no teste (GREEN)
  // refactor: organiza validações no editLead
  async editLead(id: string, data: Partial<Lead>): Promise<void> {
  if (!id) {
    throw new Error("ID do lead é obrigatório");
  }

  this.validateLead({
    nome: data.nome ?? "",
    cpf: data.cpf ?? "",
    telefone: data.telefone ?? "",
  });

  await this.repository.update(id, data);
}



validateLead(data: Omit<Lead, "id">): void {
  if (!data.nome?.trim()) {
    throw new ValidationError("nome", "Nome é obrigatório");
  }

  const cleanCpf = data.cpf.replace(/\D/g, "");
  if (!cleanCpf) {
    throw new ValidationError("cpf", "CPF é obrigatório");
  }
  if (cleanCpf.length !== 11) {
    throw new ValidationError("cpf", "CPF deve ter 11 dígitos");
  }

  const cleanPhone = data.telefone.replace(/\D/g, "");
  if (!cleanPhone) {
    throw new ValidationError("telefone", "Telefone é obrigatório");
  }
  if (cleanPhone.length !== 11) {
    throw new ValidationError("telefone", "Telefone deve conter DDD + 9 dígitos");
  }
  if (cleanPhone.charAt(2) !== "9") {
    throw new ValidationError(
      "telefone",
      "Telefone deve ser celular válido (começar com 9)"
    );
  }
}

  filterLeads(leads: Lead[], query: string): Lead[] {
    if (!query.trim()) {
      return leads;
    }
    const q = query.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.nome.toLowerCase().includes(q) ||
        lead.cpf.includes(q) ||
        lead.telefone.toLowerCase().includes(q)
    );
  }

  parseError(err: unknown, fallback = "Ocorreu um erro"): string {
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
  }
}

export const leadUseCase = new LeadUseCase(leadRepository);
