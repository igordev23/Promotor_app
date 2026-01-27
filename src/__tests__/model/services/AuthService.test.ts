import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "../../../model/services/AuthService";
import axios from "axios";
import supabase from "../../../config/supabase";



jest.spyOn(console, "error").mockImplementation(() => { });

jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock("axios", () => {
    const api = {
        post: jest.fn(),
        get: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    };
    return {
        __mockApi: api,
        default: { create: () => api },
        create: () => api,
    };
});

jest.mock("../../../config/supabase", () => ({
  auth: {
    resetPasswordForEmail: jest.fn(),
  },
}));

describe("AuthService", () => {
    const service = new AuthService();
    const mockApi = (axios as any).__mockApi;

    it("deve retornar true no login com sucesso", async () => {
        mockApi.post.mockResolvedValue({
            data: { accessToken: "token" },
        });

        const result = await service.login("promotor@test.com", "12345678");

        expect(result).toBe(true);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("deve retornar false no login com erro", async () => {
        mockApi.post.mockResolvedValue({
            data: {},
        });

        const result = await service.login("promotor@test.com", "12345678");

        expect(result).toBe(false);
    });

    it("deve retornar o token armazenado", async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token123");

  const token = await service.getToken();

  expect(token).toBe("token123");
});

it("deve retornar false quando não há token", async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

  const result = await service.isAuthenticated();

  expect(result).toBe(false);
});

    it("deve retornar false quando login lança erro", async () => {
  mockApi.post.mockRejectedValueOnce(new Error("Falha"));

  const result = await service.login("test@test.com", "123");

  expect(result).toBe(false);
});


    it("deve fazer logout", async () => {
        await service.logout();

        expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });

    it("deve verificar autenticação", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token");

        const result = await service.isAuthenticated();

        expect(result).toBe(true);
    });

    it("deve retornar usuário autenticado", async () => {
        mockApi.get.mockResolvedValue({
            data: { id: "1", email: "promotor@test.com" },
        });

        const result = await service.getUser();

        expect(result?.id).toBe("1");
        expect(result?.email).toBe("promotor@test.com");
    });

    it("deve retornar true ao recuperar senha com sucesso", async () => {
  (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
    error: null,
  });

  const result = await service.recoverPassword("test@test.com");

  expect(result).toBe(true);
});

it("deve retornar false quando supabase retornar erro", async () => {
  (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
    error: { message: "Erro" },
  });

  const result = await service.recoverPassword("test@test.com");

  expect(result).toBe(false);
});

it("deve retornar false quando recoverPassword lançar exceção", async () => {
  (supabase.auth.resetPasswordForEmail as jest.Mock).mockRejectedValue(
    new Error("Falha inesperada")
  );

  const result = await service.recoverPassword("test@test.com");

  expect(result).toBe(false);
});


});