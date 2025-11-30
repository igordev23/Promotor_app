import { useState } from "react";
import { Task } from "../model/entities/Task";
import { taskRepository } from "../model/repositories/taskRepository";

// Definição dos tipos para State e Actions
export type CreateTaskState = {
    task: Task;
    loading: boolean;
    error: string | null;
};

export type CreateTaskActions = {
createTask: (task: Task) => Promise<boolean>;
};

export const useCreateTaskViewModel = (
    initialTask: Task
): { state: CreateTaskState; actions: CreateTaskActions } => {
    // Estado
    const [task, setTask] = useState<Task>(initialTask);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

   const createTask = async (newTask: Task): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
        if (!newTask.titulo || newTask.titulo.trim().length === 0) {
            throw new Error("Título é obrigatório.");
        }

        if (!newTask.descricao || newTask.descricao.trim().length === 0) {
            throw new Error("Descrição é obrigatória.");
        }

        await taskRepository.add(newTask);
        setTask(newTask);
        return true;

    } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return false;

    } finally {
        setLoading(false);
    }
};


    // Retorno no formato MVVM
    return {
        state: {
            task,
            loading,
            error,
        },
        actions: {
            createTask,
        },
    };
};
