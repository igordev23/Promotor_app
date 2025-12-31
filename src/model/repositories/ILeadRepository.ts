import { Lead } from "../entities/Lead";

export interface ILeadRepository {
  getAll(): Promise<Lead[]>;
  getById(id: string): Promise<Lead | null>;
  create(lead: Omit<Lead, "id">): Promise<Lead>;
  update(id: string, lead: Partial<Lead>): Promise<void>;
  delete(id: string): Promise<void>;
}
