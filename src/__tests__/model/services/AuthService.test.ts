import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../../config/supabase";
import { AuthService } from "../../../model/services/AuthService";

jest.spyOn(console, "error").mockImplementation(() => { });

jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock("../../../config/supabase", () => ({
    auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        getUser: jest.fn(),
    },
}));

describe("AuthService", () => {
    const service = new AuthService();

    it("deve retornar true no login com sucesso", async () => {
        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
            data: { session: { access_token: "token" } },
            error: null,
        });

        const result = await service.login("test@email.com", "123");

        expect(result).toBe(true);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("deve retornar false no login com erro", async () => {
        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
            data: {},
            error: true,
        });

        const result = await service.login("test@email.com", "123");

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
        (supabase.auth.getUser as jest.Mock).mockResolvedValue({
            data: {
                user: { id: "1", email: "test@email.com" },
            },
        });

        const result = await service.getUser();

        expect(result?.id).toBe("1");
        expect(result?.email).toBe("test@email.com");
    });

});