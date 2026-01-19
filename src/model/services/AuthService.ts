import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../config/supabase";
import { AuthRepository } from "../repositories/AuthRepository";


const TOKEN_KEY = "auth_token";

export class AuthService implements AuthRepository {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login:", error);
        return false;
      }

      if (data.session?.access_token) {
        await AsyncStorage.setItem(TOKEN_KEY, data.session.access_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  }

  async recoverPassword(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://http://localhost:5173/resetPasswordScreen",
    });

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
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async getUser(): Promise<{ email?: string; id: string } | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ? { email: user.email, id: user.id } : null;
  }
}

export const authService = new AuthService();
