import { renderHook, act, waitFor } from "@testing-library/react";
import { useListLeadsViewModel } from "../../viewmodel/useListLeadsViewModel";
import { LeadRepositoryMemory } from "../../model/repositories/memory/LeadRepositoryMemory";
import { Lead } from "../../model/entities/Lead";

describe("useListLeadsViewModel", () => {
  let repository: LeadRepositoryMemory;

  beforeEach(() => {
    repository = new LeadRepositoryMemory();
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useListLeadsViewModel(repository));
    expect(result.current.state.leads).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test("should load leads successfully", async () => {
    await repository.create({
      nome: "Lead 1",
      cpf: "12345678900",
      email: "l1@test.com",
      telefone: "111",
      timeStamp: Date.now(),
    });

    const { result } = renderHook(() => useListLeadsViewModel(repository));

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    expect(result.current.state.leads).toHaveLength(1);
    expect(result.current.state.leads[0].nome).toBe("Lead 1");
    expect(result.current.state.loading).toBe(false);
  });

  test("should filter leads by name", async () => {
    await repository.create({
      nome: "Alice",
      cpf: "11111111111",
      email: "alice@test.com",
      telefone: "111",
      timeStamp: Date.now(),
    });
    await repository.create({
      nome: "Bob",
      cpf: "22222222222",
      email: "bob@test.com",
      telefone: "222",
      timeStamp: Date.now(),
    });

    const { result } = renderHook(() => useListLeadsViewModel(repository));

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    act(() => {
      result.current.actions.searchLeads("Ali");
    });

    expect(result.current.state.leads).toHaveLength(1);
    expect(result.current.state.leads[0].nome).toBe("Alice");
  });

  test("should reset filter", async () => {
    await repository.create({
      nome: "Alice",
      cpf: "11111111111",
      email: "alice@test.com",
      telefone: "111",
      timeStamp: Date.now(),
    });
    await repository.create({
      nome: "Bob",
      cpf: "22222222222",
      email: "bob@test.com",
      telefone: "222",
      timeStamp: Date.now(),
    });

    const { result } = renderHook(() => useListLeadsViewModel(repository));

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    act(() => {
      result.current.actions.searchLeads("Ali");
    });
    expect(result.current.state.leads).toHaveLength(1);

    act(() => {
      result.current.actions.resetFilter();
    });
    expect(result.current.state.leads).toHaveLength(2);
  });

  test("should handle error when loading leads fails", async () => {
    // Mock failure
    jest.spyOn(repository, "getAll").mockRejectedValue(new Error("Failed to load"));

    const { result } = renderHook(() => useListLeadsViewModel(repository));

    await act(async () => {
      await result.current.actions.loadLeads();
    });

    expect(result.current.state.error).toBe("Failed to load");
    expect(result.current.state.loading).toBe(false);
  });
});
