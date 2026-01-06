import { Lead } from "../../entities/Lead";
import { ILeadRepository } from "../ILeadRepository";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class LeadRepositoryMemory implements ILeadRepository {
  private leads: Lead[] = [];

  async getAll(): Promise<Lead[]> {
    return [...this.leads];
  }

  async getById(id: string): Promise<Lead | null> {
    const lead = this.leads.find((l) => l.id === id);
    return lead || null;
  }

  async create(item: Omit<Lead, "id">): Promise<Lead> {
    const newLead: Lead = {
      ...item,
      id: generateUUID(),
    };
    this.leads.push(newLead);
    return newLead;
  }

  async update(id: string, item: Partial<Lead>): Promise<void> {
    const index = this.leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      this.leads[index] = { ...this.leads[index], ...item };
    }
  }

  async delete(id: string): Promise<void> {
    this.leads = this.leads.filter((l) => l.id !== id);
  }
}
