"use client";

import { useState, useCallback } from "react";
import { getTasks } from "@/lib/api";
import { Task } from "@/types/task";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { SquarePlus } from "lucide-react";

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const updated = await getTasks();
      setTasks(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 self-start bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <SquarePlus size={16} /> Nova Tarefa
        </button>

        {showForm && (
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-900">
            <TaskForm
              onSuccess={() => {
                setShowForm(false);
                refresh();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3 text-zinc-700 dark:text-zinc-300">
          Tarefas{" "}
          {tasks.length > 0 && (
            <span className="font-normal text-zinc-400">({tasks.length})</span>
          )}
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 rounded-full border-2 border-zinc-300 border-t-green-600 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Nenhuma tarefa criada ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onUpdate={refresh} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
