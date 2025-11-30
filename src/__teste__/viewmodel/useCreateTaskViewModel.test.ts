import { renderHook, act } from "@testing-library/react";
import { useCreateTaskViewModel } from "../../viewmodel/useCreateTaskViewModel";
import { taskRepository } from "../../model/repositories/taskRepository";
import { Task } from "../../model/entities/Task";

jest.mock("../../model/repositories/taskRepository");

describe("useCreateTaskViewModel", () => {
  const mockInitialTask: Task = {
    id: "",
    titulo: "",
    descricao: "",
    timeStamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve inicializar com estado correto", () => {
    const { result } = renderHook(() => useCreateTaskViewModel(mockInitialTask));

    const { state } = result.current;

    expect(state.task).toEqual(mockInitialTask);
    expect(state.loading).toBe(false);
  });

  test("deve criar tarefa com sucesso", async () => {
    const newTask: Task = {
      id: "123",
      titulo: "Nova Tarefa",
      descricao: "Descrição da nova tarefa",
      timeStamp: Date.now(),
    };
    

    // Mock para simular que após criar, a lista de tarefas está vazia
    (taskRepository.getAll as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCreateTaskViewModel(mockInitialTask));

    await act(async () => {
      await result.current.actions.createTask(newTask);
    });

    const last = result.current.state;

    expect(last.loading).toBe(false);
  });

  test("deve lidar com erro ao criar tarefa", async () => {
    const newTask: Task = {
      id: "123",
      titulo: "Nova Tarefa",
      descricao: "Descrição da nova tarefa",
      timeStamp: Date.now(),
    };

    const mockError = new Error("Erro ao criar tarefa");
    (taskRepository.getAll as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateTaskViewModel(mockInitialTask));

    await act(async () => {
      await result.current.actions.createTask(newTask);
    });

    const last = result.current.state;

    expect(last.loading).toBe(false);
  });
});