import { renderHook, act } from "@testing-library/react";
import { useListTaskViewModel } from "../../viewmodel/useListTaskViewModel";
import { taskRepository } from "../../model/repositories/taskRepository";
import { Task } from "../../model/entities/Task";

jest.mock("../../model/repositories/taskRepository");

describe("useListTaskViewModel", () => {
  test("deve carregar tarefas com sucesso", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        titulo: "Estudar MVVM",
        descricao: "desc",
        timeStamp: Date.now(),
      },
      {
        id: "2",
        titulo: "Criar testes",
        descricao: "desc",
        timeStamp: Date.now(),
      },
    ];

    (taskRepository.getAll as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useListTaskViewModel());

    await act(async () => {
      await result.current.actions.loadTasks();
    });

    const last = result.current.state;

    expect(last.tasks.length).toBe(2);
    expect(last.tasks[0].titulo).toBe("Estudar MVVM");
    expect(last.loading).toBe(false);
  });

  test("deve deletar uma tarefa e atualizar a lista", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        titulo: "A",
        descricao: null,
        timeStamp: Date.now(),
      },
      {
        id: "2",
        titulo: "B",
        descricao: null,
        timeStamp: Date.now(),
      },
    ];

    (taskRepository.getAll as jest.Mock)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce([mockTasks[1]]);

    (taskRepository.delete as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useListTaskViewModel());

    await act(async () => {
      await result.current.actions.loadTasks();
    });

    await act(async () => {
      await result.current.actions.deleteTask(0);
    });

    const last = result.current.state;

    expect(last.tasks.length).toBe(1);
    expect(last.tasks[0].titulo).toBe("B");
  });
});
