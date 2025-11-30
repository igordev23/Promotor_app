import { useState } from "react";
import { Task } from "../model/entities/Task";
import { taskRepository } from "../model/repositories/taskRepository";

export type ListTaskState = {
    loading: boolean;
    tasks: Task[];
    error: string | null;
};

export type ListTaskActions = {
    loadTasks: () => Promise<void>;
    deleteTask: (index: number) => Promise<void>;
};

export function useListTaskViewModel(): { state: ListTaskState; actions: ListTaskActions } {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = async () => {
        try {
            setLoading(false);
            setError(null);

            await new Promise(resolve => setTimeout(resolve, 0));

            const result = await taskRepository.getAll();
            setTasks(result);
        } catch (err: any) {
            setError(err?.message || "Erro ao carregar tarefas");
        }
    };

    const deleteTask = async (index: number) => {
        try {
            setLoading(false);
            setError(null);

            await taskRepository.delete(index);
            await loadTasks();
        } catch (err: any) {
            setError(err?.message || "Erro ao excluir tarefa");
            
        }
    };

    return {
        state: {
            loading,
            tasks,
            error,
        },
        actions: {
            loadTasks,
            deleteTask,
        },
    };
}
