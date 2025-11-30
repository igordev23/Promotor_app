import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../entities/Task";
import { TaskRepository } from "../entities/Repository";

/**
 * Implementação concreta do repositório de tarefas.
 * Este repositório usa o AsyncStorage para salvar os dados LOCALMENTE,
 * funcionando como uma "simulação de banco de dados" dentro do celular.
 */
class TaskRepositoryImpl implements TaskRepository {
  // Nome da chave onde todas as tarefas serão armazenadas no AsyncStorage
  private key = "@tasks";

  /**
   * Função usada apenas em testes.
   * Remove completamente a chave @tasks do armazenamento local,
   * garantindo que cada teste comece com o "banco vazio".
   */
  async resetForTests() {
    try {
      await AsyncStorage.removeItem(this.key);
    } catch (err) {
      throw new Error("Erro ao resetar o armazenamento para testes: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Carrega a lista completa de tarefas do AsyncStorage.
   * Caso não exista nada salvo ainda, retorna um array vazio.
   */
  private async load(): Promise<Task[]> {
    try {
      const raw = await AsyncStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      throw new Error("Erro ao carregar tarefas do armazenamento: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Salva no AsyncStorage a lista completa de tarefas.
   * Converte o array de objetos para JSON antes de salvar.
   */
  private async persist(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.key, JSON.stringify(tasks));
    } catch (err) {
      throw new Error("Erro ao salvar tarefas no armazenamento: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Retorna todas as tarefas salvas no armazenamento local.
   * Útil na ViewModel para listar tudo na tela.
   */
  async getAll(): Promise<Task[]> {
    try {
      return await this.load();
    } catch (err) {
      throw new Error("Erro ao obter todas as tarefas: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Busca uma tarefa específica pelo índice (posição no array).
   * Se a posição não existir, retorna null.
   */
  async getByIndex(index: number): Promise<Task | null> {
    try {
      const tasks = await this.load();
      return tasks[index] ?? null;
    } catch (err) {
      throw new Error("Erro ao buscar tarefa pelo índice: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Adiciona uma nova tarefa ao início da lista.
   * A função unshift coloca a nova tarefa na primeira posição.
   * Depois regrava toda a lista no AsyncStorage.
   */
  async add(task: Task): Promise<void> {
    try {
      const tasks = await this.load();
      tasks.unshift(task);
      await this.persist(tasks);
    } catch (err) {
      throw new Error("Erro ao adicionar uma nova tarefa: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Atualiza uma tarefa com base no índice.
   * Apenas substitui o objeto da tarefa naquela posição.
   * Se o índice for inválido, não faz nada.
   */
  async update(index: number, task: Task): Promise<void> {
    try {
      const tasks = await this.load();
      if (index >= 0 && index < tasks.length) {
        tasks[index] = task;
        await this.persist(tasks);
      }
    } catch (err) {
      throw new Error("Erro ao atualizar a tarefa: " + (err instanceof Error ? err.message : err));
    }
  }

  /**
   * Deleta uma tarefa pelo índice.
   * Filtra todas as tarefas menos aquela da posição especificada.
   */
  async delete(index: number): Promise<void> {
    try {
      const tasks = await this.load();
      if (index >= 0 && index < tasks.length) {
        const newList = tasks.filter((_, i) => i !== index);
        await this.persist(newList);
      }
    } catch (err) {
      throw new Error("Erro ao deletar a tarefa: " + (err instanceof Error ? err.message : err));
    }
  }
}

// Instância do repositório usada pelo restante da aplicação.
export const taskRepository = new TaskRepositoryImpl();
