import { ApiResponse } from "@/types/task";
export async function handleResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "An error occurred");
  return data;
}
