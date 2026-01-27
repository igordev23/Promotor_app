import { LocationUseCase } from "../../useCases/LocationUseCase";
import { ILocationRepository } from "../../model/repositories/ILocationRepository";
import { Location } from "../../model/entities/Location";

describe("LocationUseCase", () => {
    let repositoryMock: jest.Mocked<ILocationRepository>;
    let useCase: LocationUseCase;

    beforeEach(() => {
        repositoryMock = {
            getCurrentLocation: jest.fn(),
            getLocationHistory: jest.fn(),
            sendLocation: jest.fn(),
        };

        useCase = new LocationUseCase(repositoryMock);
    });

    it("deve buscar a localização atual", async () => {
        const location: Location = {
            idPromotor: "123",
            latitude: 1,
            longitude: 2,
            timestamp: Date.now(),
        };

        repositoryMock.getCurrentLocation.mockResolvedValue(location);

        const result = await useCase.getCurrentLocation("123");

        expect(result).toEqual(location);
        expect(repositoryMock.getCurrentLocation).toHaveBeenCalledWith("123");
    });

    it("deve buscar o histórico de localização", async () => {
        const history: Location[] = [];

        repositoryMock.getLocationHistory.mockResolvedValue(history);

        const result = await useCase.getLocationHistory("123");

        expect(result).toEqual(history);
        expect(repositoryMock.getLocationHistory).toHaveBeenCalledWith("123");
    });

    it("deve enviar localização", async () => {
        const payload = {
            idPromotor: "123",
            latitude: 1,
            longitude: 2,
            timestamp: Date.now(),
        };

        await useCase.sendLocation(payload);

        expect(repositoryMock.sendLocation).toHaveBeenCalledWith(payload);
    });

    it("deve tratar erro com parseError", () => {
        const message = useCase.parseError("erro");

        expect(message).toBe("erro");
    });

    it("deve retornar fallback quando erro for null", () => {
        const message = useCase.parseError(null);
        expect(message).toBe("Ocorreu um erro");
    });

    it("deve retornar message quando erro for instancia de Error", () => {
        const error = new Error("Erro padrão");
        const message = useCase.parseError(error);

        expect(message).toBe("Erro padrão");
    });

    it("deve retornar message quando erro for objeto com message", () => {
        const error = { message: "Erro do backend" };
        const message = useCase.parseError(error);

        expect(message).toBe("Erro do backend");
    });

    it("deve retornar JSON.stringify quando erro for objeto sem message", () => {
        const error = { code: 500 };
        const message = useCase.parseError(error);

        expect(message).toBe(JSON.stringify(error));
    });
    
    it("deve retornar fallback quando JSON.stringify falhar", () => {
        const circular: any = {};
        circular.self = circular; // causa erro no stringify

        const message = useCase.parseError(circular, "fallback");

        expect(message).toBe("fallback");
    });


});