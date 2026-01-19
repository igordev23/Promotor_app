import { JourneyUseCase } from "../../useCases/JourneyUseCase";
import { IJourneyRepository } from "../../model/repositories/IJourneyRepository";

describe("JourneyUseCase – Erros", () => {
    const repositoryMock: IJourneyRepository = {
        startJourney: jest.fn(),
        endJourney: jest.fn(),
        getJourneyStatus: jest.fn(),
    };

    const useCase = new JourneyUseCase(repositoryMock);

    it("deve propagar erro ao iniciar jornada", async () => {
        (repositoryMock.startJourney as jest.Mock).mockRejectedValue(
            new Error("Erro start")
        );

        await expect(useCase.startJourney("1")).rejects.toThrow("Erro start");
    });

    it("deve propagar erro ao encerrar jornada", async () => {
        (repositoryMock.endJourney as jest.Mock).mockRejectedValue(
            new Error("Erro end")
        );

        await expect(useCase.endJourney("1")).rejects.toThrow("Erro end");
    });
});