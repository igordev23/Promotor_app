import { LocationUseCase } from "../../useCases/LocationUseCase";
import { ILocationRepository } from "../../model/repositories/ILocationRepository";

describe("LocationUseCase – Erros", () => {
    const repositoryMock: ILocationRepository = {
        getCurrentLocation: jest.fn(),
        getLocationHistory: jest.fn(),
        sendLocation: jest.fn(),
    };

    const useCase = new LocationUseCase(repositoryMock);

    it("deve propagar erro ao buscar localização atual", async () => {
        (repositoryMock.getCurrentLocation as jest.Mock).mockRejectedValue(
            new Error("Erro localização")
        );

        await expect(useCase.getCurrentLocation("1")).rejects.toThrow(
            "Erro localização"
        );
    });

    it("deve propagar erro ao enviar localização", async () => {
        (repositoryMock.sendLocation as jest.Mock).mockRejectedValue(
            new Error("Erro envio")
        );

        await expect(
            useCase.sendLocation({
                idPromotor: "1",
                latitude: 1,
                longitude: 1,
                timestamp: Date.now(),
            })
        ).rejects.toThrow("Erro envio");
    });
});