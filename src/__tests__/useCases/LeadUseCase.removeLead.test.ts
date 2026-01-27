import { LeadUseCase } from "../../useCases/LeadUseCase";
import { ILeadRepository } from "../../model/repositories/ILeadRepository";

describe("TDD - LeadUseCase.removeLead", () => {
  it("deve remover um lead pelo id", async () => {
    const repositoryMock: jest.Mocked<ILeadRepository> = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    repositoryMock.delete.mockResolvedValue();

    const useCase = new LeadUseCase(repositoryMock);

    await useCase.removeLead("123");

    expect(repositoryMock.delete).toHaveBeenCalledWith("123");
  });
});