import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "../../../model/services/AuthService";
import axios from "axios";

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

});