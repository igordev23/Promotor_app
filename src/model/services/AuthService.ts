import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../config/supabase";
import { AuthRepository } from "../repositories/AuthRepository";

import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const TOKEN_KEY = "auth_token";

export class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem(TOKEN_KEY);
        }
        return Promise.reject(error);
      }

      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  }

  async recoverPassword(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Erro ao recuperar senha:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro inesperado:", error);
    return false;
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  }

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.getToken());
  }

  async getUser(): Promise<{ id: string; email: string } | null> {
    try {
      const { data } = await this.api.get('/auth/me');
      return data;
    } catch {
      return null;
    }
  }
}
export const authService = new AuthService();