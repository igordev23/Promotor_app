import { Lead } from "../../entities/Lead";
import { ILeadRepository } from "../ILeadRepository";

export class LeadRepositoryMemory implements ILeadRepository {
    private leads: Lead[] = [];

    async getAll(): Promise<Lead[]> {
        return [...this.leads];
    }

    async getById(id: number): Promise<Lead | null> {
        const lead = this.leads.find(l => l.id === id);
        return lead || null;
    }

    async create(item: Omit<Lead, "id">): Promise<Lead> {
        const newLead: Lead = {
            ...item,
            id: Date.now() + Math.floor(Math.random() * 1000),
        };
        this.leads.push(newLead);
        return newLead;
    }

    async update(id: number, item: Partial<Lead>): Promise<void> {
        const index = this.leads.findIndex(l => l.id === id);
        if (index !== -1) {
            this.leads[index] = { ...this.leads[index], ...item };
        }
    }

    async delete(id: number): Promise<void> {
        this.leads = this.leads.filter(l => l.id !== id);
    }
}
