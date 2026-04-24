import { getTasks } from "@/lib/api.server";
import { TaskList } from "./components/TaskList";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-12 px-4">
        <h1 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">
          Lista de Tarefas
        </h1>
        <TaskList initialTasks={tasks} />
      </main>
    </div>
  );
}
