import { LeadRepositoryMemory } from "../../model/repositories/memory/LeadRepositoryMemory";
import { Lead } from "../../model/entities/Lead";

describe("LeadRepositoryMemory", () => {
    let repository: LeadRepositoryMemory;

    beforeEach(() => {
        repository = new LeadRepositoryMemory();
    });

    test("should start empty", async () => {
        const leads = await repository.getAll();
        expect(leads).toEqual([]);
    });

    test("should create a lead", async () => {
        const leadData: Omit<Lead, "id"> = {
            nome: "Test Lead",
            email: "test@example.com",
            telefone: "123456789",
            timeStamp: Date.now(),
        };

        const created = await repository.create(leadData);

        expect(created.id).toBeDefined();
        expect(created.nome).toBe(leadData.nome);

        const leads = await repository.getAll();
        expect(leads).toHaveLength(1);
        expect(leads[0]).toEqual(created);
    });

    test("should update a lead", async () => {
        const leadData: Omit<Lead, "id"> = {
            nome: "Old Name",
            email: "old@example.com",
            telefone: "111",
            timeStamp: Date.now(),
        };
        const created = await repository.create(leadData);

        await repository.update(created.id, { nome: "New Name" });

        const updated = await repository.getById(created.id);
        expect(updated?.nome).toBe("New Name");
        expect(updated?.email).toBe("old@example.com");
    });

    test("should delete a lead", async () => {
        const lead = await repository.create({
            nome: "To Delete",
            email: "del@example.com",
            telefone: "000",
            timeStamp: Date.now(),
        });

        await repository.delete(lead.id);

        const leads = await repository.getAll();
        expect(leads).toHaveLength(0);
    });
});
