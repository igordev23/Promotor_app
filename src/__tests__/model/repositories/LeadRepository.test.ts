/**
 * Testes do LeadRepository
 * Camada: Repository
 * Estratégia: Mock de axios + authService
 */

import axios from "axios";

/* =======================
   MOCKS (ANTES DO IMPORT)
   ======================= */

let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
    consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => { });
});

afterAll(() => {
    consoleErrorSpy.mockRestore();
});

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();
const mockUse = jest.fn();

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete,
        interceptors: {
            request: {
                use: mockUse,
            },
        },
    })),
}));

jest.mock("../../../model/services/AuthService", () => ({
    authService: {
        getToken: jest.fn().mockResolvedValue("fake-token"),
    },
}));

/* =======================
   IMPORT APÓS OS MOCKS
   ======================= */

import { LeadRepository } from "../../../model/repositories/leadRepository";

/* =======================
   TESTES
   ======================= */

describe("LeadRepository", () => {
    let repository: LeadRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new LeadRepository();
    });

    it("deve registrar o interceptor de autenticação", () => {
        expect(mockUse).toHaveBeenCalled();
    });

    it("deve buscar todos os leads", async () => {
        mockGet.mockResolvedValueOnce({
            data: [{ id: "1", nome: "Lead Teste", cpf: "123", telefone: "999" }],
        });

        const result = await repository.getAll();

        expect(result).toHaveLength(1);
        expect(mockGet).toHaveBeenCalledWith("/promotor/leads");
    });

    it("deve buscar lead por id", async () => {
        mockGet.mockResolvedValueOnce({
            data: { id: "1", nome: "Lead Único" },
        });

        const result = await repository.getById("1");

        expect(result?.id).toBe("1");
        expect(mockGet).toHaveBeenCalledWith("/promotor/leads/1");
    });

    it("deve retornar null se buscar lead falhar", async () => {
        mockGet.mockRejectedValueOnce(new Error("erro"));

        const result = await repository.getById("1");

        expect(result).toBeNull();
    });

    it("deve criar um lead", async () => {
        mockPost.mockResolvedValueOnce({
            data: { id: "1", nome: "Novo Lead" },
        });

        const result = await repository.create({
            nome: "Novo Lead",
            telefone: "999",
            cpf: "000",
        });

        expect(result.id).toBe("1");
        expect(mockPost).toHaveBeenCalledWith("/promotor/leads", {
            nome: "Novo Lead",
            telefone: "999",
            cpf: "000",
        });
    });

    it("deve atualizar um lead", async () => {
        mockPut.mockResolvedValueOnce({});

        await expect(
            repository.update("1", { nome: "Atualizado" })
        ).resolves.not.toThrow();

        expect(mockPut).toHaveBeenCalledWith("/promotor/leads/1", {
            nome: "Atualizado",
            telefone: undefined,
            cpf: undefined,
        });
    });

    it("deve deletar um lead", async () => {
        mockDelete.mockResolvedValueOnce({});

        await expect(repository.delete("1")).resolves.not.toThrow();

        expect(mockDelete).toHaveBeenCalledWith("/promotor/leads/1");
    });

    it("deve lançar erro ao falhar no getAll", async () => {
        mockGet.mockRejectedValueOnce({
            response: { data: { message: "Erro API" } },
        });

        await expect(repository.getAll()).rejects.toThrow("Erro API");
    });

    it("deve lançar erro ao falhar na criação", async () => {
        mockPost.mockRejectedValueOnce(new Error("Erro create"));

        await expect(
            repository.create({ nome: "X", telefone: "1", cpf: "2" })
        ).rejects.toThrow("Erro create");
    });
});