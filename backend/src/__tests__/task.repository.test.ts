import { TaskRepository } from "../repositories/task.repository";
import { db } from "../database/inMemory";

let repository: TaskRepository;

beforeEach(() => {
  db.splice(0, db.length);
  repository = new TaskRepository();
});

describe("TaskRepository.findAll", () => {
  it("retorna array vazio quando não há tasks", () => {
    expect(repository.findAll()).toEqual([]);
  });

  it("retorna todas as tasks cadastradas", () => {
    repository.create({ title: "Task 1", description: "" });
    repository.create({ title: "Task 2", description: "" });

    expect(repository.findAll()).toHaveLength(2);
  });
});

describe("TaskRepository.create", () => {
  it("cria task com id gerado, completed false e createdAt", () => {
    const task = repository.create({ title: "Nova task", description: "desc" });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Nova task");
    expect(task.description).toBe("desc");
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it("adiciona a task ao banco", () => {
    repository.create({ title: "Task", description: "" });

    expect(db).toHaveLength(1);
  });
});

describe("TaskRepository.findById", () => {
  it("retorna a task pelo id", () => {
    const created = repository.create({ title: "Task", description: "" });

    const found = repository.findById(created.id);

    expect(found).toEqual(created);
  });

  it("retorna undefined para id inexistente", () => {
    expect(repository.findById("id-invalido")).toBeUndefined();
  });
});

describe("TaskRepository.update", () => {
  it("atualiza os campos da task", () => {
    const created = repository.create({ title: "Original", description: "" });

    const updated = repository.update(created.id, {
      title: "Atualizado",
      completed: true,
    });

    expect(updated?.title).toBe("Atualizado");
    expect(updated?.completed).toBe(true);
    expect(updated?.description).toBe("");
  });

  it("retorna undefined para id inexistente", () => {
    expect(repository.update("inexistente", { title: "X" })).toBeUndefined();
  });
});

describe("TaskRepository.delete", () => {
  it("remove a task e retorna true", () => {
    const created = repository.create({ title: "Task", description: "" });

    const result = repository.delete(created.id);

    expect(result).toBe(true);
    expect(db).toHaveLength(0);
  });

  it("retorna false para id inexistente", () => {
    expect(repository.delete("inexistente")).toBe(false);
  });
});
