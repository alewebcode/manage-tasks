import { randomUUID } from "crypto";
import { db } from "../database/inMemory";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../models/task.model";

export class TaskRepository {
  findAll(): Task[] {
    return db;
  }

  findById(id: string): Task | undefined {
    return db.find((task) => task.id === id);
  }

  create(data: CreateTaskDTO): Task {
    const task: Task = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.push(task);
    return task;
  }

  update(id: string, data: UpdateTaskDTO): Task | undefined {
    const index = db.findIndex((task) => task.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated: Task = { ...db[index]!, ...data };
    db[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const index = db.findIndex((task) => task.id === id);

    if (index === -1) {
      return false;
    }

    db.splice(index, 1);
    return true;
  }
}
