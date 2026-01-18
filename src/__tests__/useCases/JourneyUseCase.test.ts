import { JourneyUseCase } from "../../useCases/JourneyUseCase";
import { IJourneyRepository } from "../../model/repositories/IJourneyRepository";
import { Journey } from "../../model/entities/Journey";

describe("JourneyUseCase", () => {
  let repositoryMock: jest.Mocked<IJourneyRepository>;
  let useCase: JourneyUseCase;

  beforeEach(() => {
    repositoryMock = {
      startJourney: jest.fn(),
      endJourney: jest.fn(),
      getJourneyStatus: jest.fn(),
    };

    useCase = new JourneyUseCase(repositoryMock);
  });

  it("deve iniciar uma jornada", async () => {
    await useCase.startJourney("123");

    expect(repositoryMock.startJourney).toHaveBeenCalledWith("123");
  });

  it("deve encerrar uma jornada", async () => {
    await useCase.endJourney("123");

    expect(repositoryMock.endJourney).toHaveBeenCalledWith("123");
  });

  it("deve retornar o status da jornada", async () => {
    const journey: Journey = { status: "ativo" };

    repositoryMock.getJourneyStatus.mockResolvedValue(journey);

    const result = await useCase.getJourneyStatus("123");

    expect(result).toEqual(journey);
    expect(repositoryMock.getJourneyStatus).toHaveBeenCalledWith("123");
  });

  it("deve tratar erro com parseError", () => {
    const error = new Error("Erro de teste");

    const message = useCase.parseError(error);

    expect(message).toBe("Erro de teste");
  });
});