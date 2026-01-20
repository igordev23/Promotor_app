import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import supabase from "../../config/supabase";

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
    );
  }

  //  LOGIN VIA BACKEND
  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data } = await this.api.post("/auth/login", {
        email,
        password,
      });

      if (!data?.accessToken) {
        console.error("Token não retornado:", data);
        return false;
      }

      await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
      return true;
    } catch (error: any) {
      console.error(
        "Erro no login:",
        error?.response?.data?.error || error.message
      );
      return false;
    }
  }
  //  LOGOUT (estateless no backend)
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);

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
}

}
export const authService = new AuthService();