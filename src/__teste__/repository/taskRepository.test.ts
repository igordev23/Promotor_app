import { taskRepository } from "../../model/repositories/taskRepository";

/**
 * Testes reais do repositório usando o AsyncStorage verdadeiro.
 * 
 * Aqui NÃO usamos mocks, então:
 * - os dados realmente são gravados no armazenamento local do ambiente de teste
 * - cada teste roda isolado usando resetForTests()
 */

describe("TaskRepository (AsyncStorage REAL)", () => {

  /**
   * Antes de cada teste, limpamos completamente o AsyncStorage.
   * Assim garantimos que cada teste começa com a 'base de dados' vazia.
   */
  beforeEach(async () => {
    await taskRepository.resetForTests();
  });

  /**
   * Testa se o repositório começa vazio quando não existem tarefas salvas.
   */
  test("Testa se o repositório começa vazio quando não existem tarefas salvas.", async () => {
    const tasks = await taskRepository.getAll();  // busca todas as tarefas
    expect(tasks).toEqual([]);                    // deve retornar lista vazia
  });

  /**
   * Testa se uma tarefa é corretamente adicionada ao AsyncStorage.
   */
  test("Testa se uma tarefa é corretamente adicionada ao AsyncStorage.", async () => {
    await taskRepository.add({
      titulo: "Teste",
      descricao: null,
      id: "1",
      timeStamp: null
    });

    const tasks = await taskRepository.getAll();

    expect(tasks.length).toBe(1);          // deve ter exatamente 1 tarefa
    expect(tasks[0].titulo).toBe("Teste"); // o título deve ser o que enviamos
  });

  /**
   * Testa se é possível recuperar uma tarefa pela sua posição no array.
   */
  test("Testa se é possível recuperar uma tarefa pela sua posição no array.", async () => {
    await taskRepository.add({
      titulo: "T1",
      descricao: null,
      id: "1",
      timeStamp: null
    });

    const task = await taskRepository.getByIndex(0);

    expect(task).not.toBeNull();
    expect(task?.titulo).toBe("T1");        // mesma tarefa inserida
  });

  /**
   * Testa se a atualização de uma tarefa funciona corretamente.
   */
  test("Testa se a atualização de uma tarefa funciona corretamente.", async () => {
    await taskRepository.add({
      titulo: "Old",
      descricao: null,
      id: "1",
      timeStamp: null
    });

    // atualiza o item na posição 0
    await taskRepository.update(0, {
      titulo: "New",
      descricao: null,
      id: "1",
      timeStamp: null
    });

    const task = await taskRepository.getByIndex(0);

    expect(task?.titulo).toBe("New");     // título deve ter sido atualizado
  });

  /**
   * Testa se a exclusão de uma tarefa funciona corretamente.
   * Importante: como usamos unshift (insere no início),
   * a primeira tarefa adicionada acaba ficando no final da lista.
   */
  test("Testa se a exclus'ão de uma tarefa funciona corretamente.", async () => {
    await taskRepository.add({
      titulo: "A",
      descricao: null,
      id: "1",
      timeStamp: null
    });

    await taskRepository.add({
      titulo: "B",
      descricao: null,
      id: "2",
      timeStamp: null
    });

    // Deleta o item no index 0 (que será o "B", porque unshift coloca no topo)
    await taskRepository.delete(0);

    const tasks = await taskRepository.getAll();

    expect(tasks.length).toBe(1);       // deve restar apenas 1 tarefa
    expect(tasks[0].titulo).toBe("A");  // "A" é a tarefa remanescente
  });
});
