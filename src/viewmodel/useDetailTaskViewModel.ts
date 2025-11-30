import { useState } from "react";
import { Task } from "../model/entities/Task";
import { taskRepository } from "../model/repositories/taskRepository";

export type UseDetailTaskViewModelState = {
    loading: boolean;
    task: Task | null;
    error: string | null;
};

export type UseDetailTaskViewModelActions = {
    loadTask: (index: number) => Promise<void>;
    updateTask: (index: number, task: Task) => Promise<boolean>; // Retorna sucesso
    deleteTask: (index: number) => Promise<boolean>; // Retorna sucesso
};

export const useDetailTaskViewModel = (
    initialTask: Task | null
): { state: UseDetailTaskViewModelState; actions: UseDetailTaskViewModelActions } => {
    const [task, setTask] = useState<Task | null>(initialTask);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadTask = async (index: number) => {
        setLoading(true);
        setError(null);
        try {
            const found = await taskRepository.getByIndex(index);
            if (!found) {
                setError("Tarefa não encontrada");
            }
            setTask(found);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar a tarefa");
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (index: number, task: Task): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await taskRepository.update(index, task);
            await loadTask(index);
            return true; // Indica sucesso
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar a tarefa");
            return false; // Indica falha
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (index: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await taskRepository.delete(index);
            setTask(null); // Limpa a tarefa atual após a exclusão
            return true; // Indica sucesso
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao deletar a tarefa");
            return false; // Indica falha
        } finally {
            setLoading(false);
        }
    };

    return {
        state: {
            task,
            loading,
            error,
        },
        actions: {
            loadTask,
            updateTask,
            deleteTask,
        },
    };
};
