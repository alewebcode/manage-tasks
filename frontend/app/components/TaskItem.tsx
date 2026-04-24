"use client";

import { useState } from "react";
import { deleteTask, updateTask } from "@/lib/api";
import { Task } from "@/types/task";
import { TaskForm } from "./TaskForm";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/app/context/ToastContext";

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function handleToggleCompleted() {
    setToggling(true);
    try {
      await updateTask(task.id, { completed: !task.completed });
      toast.success(task.completed ? "Tarefa reaberta!" : "Tarefa concluída!");
      onUpdate();
    } catch {
      toast.error("Erro ao atualizar a tarefa.");
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Tarefa removida!");
      onUpdate();
    } catch {
      toast.error("Erro ao remover a tarefa.");
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-900">
        <TaskForm
          task={task}
          onSuccess={() => {
            setEditing(false);
            onUpdate();
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-900 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleCompleted}
          disabled={toggling}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-green-600 disabled:opacity-50"
        />
        <div className="min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              task.completed
                ? "line-through text-zinc-400"
                : "text-zinc-900 dark:text-white"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setEditing(true)}
          aria-label="Editar task"
          className="text-blue-500 hover:text-blue-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Deletar task"
          className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
