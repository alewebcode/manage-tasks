import { ApiResponse, Task } from "@/types/task";
import { handleResponse } from "@/lib/api.utils";

const API_URL = process.env.API_URL || "http://localhost:3001";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/items`, { cache: "no-store" });

  const json: ApiResponse<Task[]> = await handleResponse(res);
  return json.data ?? [];
}
