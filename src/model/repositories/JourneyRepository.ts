import axios from "axios";
import { Journey } from "../entities/Journey";
import { IJourneyRepository } from "./IJourneyRepository";
import { API_BASE_URL } from "../../config/api";
import { authService } from "../services/AuthService";

export class JourneyRepository implements IJourneyRepository {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // Aumentado para 60s devido ao cold start do Render
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

  async startJourney(idPromotor: string): Promise<void> {
    try {
      await this.api.post("/promotor/jornada/iniciar", { idPromotor });
    } catch (error: any) {
      console.error("Erro ao iniciar jornada:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao iniciar jornada";
      throw new Error(msg);
    }
  }

  async endJourney(idPromotor: string): Promise<void> {
    try {
      await this.api.post("/promotor/jornada/finalizar", { idPromotor });
    } catch (error: any) {
      console.error("Erro ao finalizar jornada:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao finalizar jornada";
      throw new Error(msg);
    }
  }

  async getJourneyStatus(idPromotor: string): Promise<Journey> {
    try {
      const response = await this.api.get("/promotor/jornada/status");
      const data = response.data;
      return {
        ...data,
        idPromotor: data.promotor_id || data.idPromotor, // Fallback para garantir compatibilidade
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Se retornar 404, assumimos que não há jornada ativa
        return {
          idPromotor: idPromotor,
          status: "inativo",
        };
      }
      console.error("Erro ao buscar status da jornada:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao carregar status da jornada";
      throw new Error(msg);
    }
  }
}
