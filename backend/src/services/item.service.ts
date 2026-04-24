import { TaskRepository } from "../repositories/task.repository";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../models/task.model";

export class ItemService {
  private repository: TaskRepository;

  constructor(repository = new TaskRepository()) {
    this.repository = repository;
  }

  getAll(): Task[] {
    return this.repository.findAll();
  }

  getById(id: string): Task | undefined {
    return this.repository.findById(id);
  }

  create(data: CreateTaskDTO): Task {
    if (!data.title || data.title.trim() === "") {
      throw new Error("Title is required");
    }

    return this.repository.create(data);
  }

  update(id: string, data: UpdateTaskDTO): Task | undefined {
    const exists = this.repository.findById(id);

    if (!exists) {
      return undefined;
    }

    return this.repository.update(id, data);
  }

  delete(id: string): boolean {
    return this.repository.delete(id);
  }
}
