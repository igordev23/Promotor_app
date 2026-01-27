import { LeadUseCase } from "../../useCases/LeadUseCase";
import { ILeadRepository } from "../../model/repositories/ILeadRepository";
import { Lead } from "../../model/entities/Lead";

describe("TDD - LeadUseCase.editLead", () => {
  it("deve editar os dados de um lead", async () => {
    const repositoryMock: jest.Mocked<ILeadRepository> = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    repositoryMock.update.mockResolvedValue();

    const useCase = new LeadUseCase(repositoryMock);

    const data: Partial<Lead> = {
      nome: "Lead Editado",
      cpf: "12345678900",
      telefone: "11999999999",
    };

    await useCase.editLead("1", data);

    expect(repositoryMock.update).toHaveBeenCalledWith("1", data);
  });
});