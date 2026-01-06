import axios from "axios";
import { Location } from "../entities/Location";
import { ILocationRepository } from "./ILocationRepository";
import { API_BASE_URL } from "../../config/api";
import { authService } from "../services/AuthService";

export class LocationRepository implements ILocationRepository {
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

  async getCurrentLocation(idPromotor: string): Promise<Location> {
    try {
      const response = await this.api.get(
        `/supervisor/promotores/${idPromotor}/localizacao-atual`
      );
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar localização atual:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao carregar localização atual";
      throw new Error(msg);
    }
  }

  async getLocationHistory(idPromotor: string): Promise<Location[]> {
    try {
      const response = await this.api.get(
        `/supervisor/promotores/${idPromotor}/historico-localizacao`
      );
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar histórico de localização:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao carregar histórico de localização";
      throw new Error(msg);
    }
  }

  async sendLocation(payload: {
    idPromotor: string;
    latitude: number;
    longitude: number;
    timestamp: number;
  }): Promise<void> {
    try {
      await this.api.post(`/promotor/localizacao`, payload);
    } catch (error: any) {
      console.error("Erro ao enviar localização:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Falha ao enviar localização";
      throw new Error(msg);
    }
  }
}
