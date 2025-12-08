import { Lead } from "../entities/Lead";

export interface ILeadRepository {
    getAll(): Promise<Lead[]>;
    getById(id: number): Promise<Lead | null>;
    create(lead: Omit<Lead, "id">): Promise<Lead>;
    update(id: number, lead: Partial<Lead>): Promise<void>;
    delete(id: number): Promise<void>;
}
