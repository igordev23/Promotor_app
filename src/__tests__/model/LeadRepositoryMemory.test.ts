import { LeadRepositoryMemory } from "../../model/repositories/memory/LeadRepositoryMemory";
import { Lead } from "../../model/entities/Lead";

describe("LeadRepositoryMemory", () => {
  let repository: LeadRepositoryMemory;

  beforeEach(() => {
    repository = new LeadRepositoryMemory();
  });

  test("should start with empty lead list", async () => {
    const leads = await repository.getAll();
    expect(leads).toEqual([]);
  });

  test("should create a lead", async () => {
    const leadData: Omit<Lead, "id"> = {
      nome: "Test Lead",
      cpf: "12345678900",
      telefone: "123456789",
    };

    const created = await repository.create(leadData);

    expect(created.id).toBeDefined();
    expect(created.nome).toBe(leadData.nome);

    const leads = await repository.getAll();
    expect(leads).toHaveLength(1);
    expect(leads[0]).toEqual(created);
  });

  test("should retrieve a lead by id", async () => {
    const created = await repository.create({
      nome: "Find Me",
      cpf: "12345678900",
      telefone: "111",
    });

    const found = await repository.getById(created.id);

    expect(found).toEqual(created);
  });

  test("should return null when getting a non-existing lead", async () => {
    const lead = await repository.getById("non-existing-id");
    expect(lead).toBeNull();
  });

  test("should update a lead", async () => {
    const created = await repository.create({
      nome: "Old Name",
      cpf: "12345678900",
      telefone: "111",
    });

    await repository.update(created.id, { nome: "New Name" });

    const updated = await repository.getById(created.id);
    expect(updated?.nome).toBe("New Name");
  });

  test("should not update when lead does not exist", async () => {
    await repository.update("invalid-id", { nome: "Should Not Work" });

    const leads = await repository.getAll();
    expect(leads).toHaveLength(0);
  });

  test("should delete a lead", async () => {
    const lead = await repository.create({
      nome: "To Delete",
      cpf: "12345678900",
      telefone: "000",
    });

    await repository.delete(lead.id);

    const leads = await repository.getAll();
    expect(leads).toHaveLength(0);
  });

  test("should not throw when deleting a non-existing lead", async () => {
    await expect(repository.delete("invalid-id")).resolves.not.toThrow();

    const leads = await repository.getAll();
    expect(leads).toEqual([]);
  });
});
