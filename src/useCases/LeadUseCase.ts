import { ILeadRepository } from "../model/repositories/ILeadRepository";
import { Lead } from "../model/entities/Lead";
import { leadRepository } from "../model/repositories/leadRepository";

export class LeadUseCase {
  constructor(private repository: ILeadRepository) { }

  async getLeads(): Promise<Lead[]> {
    return this.repository.getAll();
  }

  async createLead(lead: Omit<Lead, "id">): Promise<Lead> {
    this.validateLead(lead);
    return this.repository.create(lead);
  }

  // feat: implementa removeLead no LeadUseCase para passar no teste (GREEN)
  // refactor: melhora validação no removeLead
  async removeLead(id: string): Promise<void> {
    if (!id) {
      throw new Error("ID do lead é obrigatório");
    }
    await this.repository.delete(id);
  }

  // feat: implementa editLead no LeadUseCase para passar no teste (GREEN)
  async editLead(id: string, data: Partial<Lead>): Promise<void> {
    if (!id) {
      throw new Error("ID do lead é obrigatório");
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Dados para atualização são obrigatórios");
    }
    await this.repository.update(id, data);
  }

  validateLead(data: Omit<Lead, "id">): void {
    if (!data.nome?.trim()) {
      throw new Error("Nome é obrigatório");
    }
    if (!data.cpf?.trim()) {
      throw new Error("CPF é obrigatório");
    }
    const cleanCpf = data.cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      throw new Error("CPF deve ter 11 dígitos");
    }
    if (!data.telefone?.trim()) {
      throw new Error("Telefone é obrigatório");
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
