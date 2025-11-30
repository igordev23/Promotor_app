import { Task } from "./Task";

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getByIndex(index: number): Promise<Task | null>;
  add(task: Task): Promise<void>;
  update(index: number, task: Task): Promise<void>;
  delete(index: number): Promise<void>;
}
