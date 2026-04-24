import { ApiResponse, Task } from "@/types/task";
import { handleResponse } from "@/lib/api.utils";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  const json: ApiResponse<Task[]> = await handleResponse(res);
  return json.data ?? [];
}

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">,
): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const json: ApiResponse<Task> = await handleResponse(res);
  return json.data!;
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const json: ApiResponse<Task> = await handleResponse(res);
  return json.data!;
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  await handleResponse(res);
}
