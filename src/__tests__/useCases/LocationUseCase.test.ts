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
});