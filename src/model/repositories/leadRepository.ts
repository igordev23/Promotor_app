import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lead } from "../entities/Lead";
import { ILeadRepository } from "./ILeadRepository";

const STORAGE_KEY = "leads";

export class LeadRepository implements ILeadRepository {

    private async load(): Promise<Lead[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error loading leads", error);
            return [];
        }
    }

    private async save(leads: Lead[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        } catch (error) {
             console.error("Error saving leads", error);
        }
    }

    async getAll(): Promise<Lead[]> {
        return this.load();
    }

    async getById(id: number): Promise<Lead | null> {
        const leads = await this.load();
        return leads.find(l => l.id === id) || null;
    }

    async create(item: Omit<Lead, "id">): Promise<Lead> {
        const leads = await this.load();

        const newLead: Lead = {
            ...item,
            id: Date.now(),
        };

        leads.push(newLead);
        await this.save(leads);

        return newLead;
    }

    async update(id: number, item: Partial<Lead>): Promise<void> {
        const leads = await this.load();

        const index = leads.findIndex(l => l.id === id);
        if (index === -1) return;

        leads[index] = { ...leads[index], ...item };
        await this.save(leads);
    }

    async delete(id: number): Promise<void> {
        const leads = await this.load();
        const filtered = leads.filter(l => l.id !== id);
        await this.save(filtered);
    }
}

export const leadRepository = new LeadRepository();
