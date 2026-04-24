export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskDTO = Pick<Task, "title" | "description">;

export type UpdateTaskDTO = Partial<Pick<Task, "title" | "description" | "completed">>;
