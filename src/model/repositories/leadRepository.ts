import axios from "axios";
import { Lead } from "../entities/Lead";
import { ILeadRepository } from "./ILeadRepository";
import { API_BASE_URL } from "../../config/api";
import { authService } from "../services/AuthService";

export class LeadRepository implements ILeadRepository {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    // Interceptor para adicionar token de auth automaticamente
    this.api.interceptors.request.use(async (config) => {
      const token = await authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getAll(): Promise<Lead[]> {
    try {
      const response = await this.api.get("/promotor/leads");
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar leads:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao carregar leads";
      throw new Error(msg);
    }
  }

  async getById(id: string): Promise<Lead | null> {
    try {
      const response = await this.api.get(`/promotor/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar lead por ID:", error);
      return null;
    }
  }

  async create(item: Omit<Lead, "id">): Promise<Lead> {
    try {
      const payload = {
        nome: item.nome,
        telefone: item.telefone,
        cpf: item.cpf,
      };
      const response = await this.api.post("/promotor/leads", payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar lead:", error);
      const msg =
        error.response?.data?.message || error.message || "Falha ao criar lead";
      throw new Error(msg);
    }
  }

  async update(id: string, item: Partial<Lead>): Promise<void> {
    try {
      const payload = {
        nome: item.nome,
        telefone: item.telefone,
        cpf: item.cpf,
      };
      await this.api.put(`/promotor/leads/${id}`, payload);
    } catch (error: any) {
      console.error("Erro ao atualizar lead:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao atualizar lead";
      throw new Error(msg);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/promotor/leads/${id}`);
    } catch (error: any) {
      console.error("Erro ao deletar lead:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao deletar lead";
      throw new Error(msg);
    }
  }
}

export const leadRepository = new LeadRepository();
