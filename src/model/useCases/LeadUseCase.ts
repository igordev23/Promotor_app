import { ILeadRepository } from "../repositories/ILeadRepository";
import { Lead } from "../entities/Lead";

export class LeadUseCase {
  constructor(private repository: ILeadRepository) {}

  async getLeads(): Promise<Lead[]> {
    return this.repository.getAll();
  }

  async createLead(lead: Omit<Lead, "id">): Promise<Lead> {
      return this.repository.create(lead);
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
