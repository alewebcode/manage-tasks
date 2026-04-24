"use client";

import { useState } from "react";
import { createTask, updateTask } from "@/lib/api";
import { Task } from "@/types/task";
import { useToast } from "@/app/context/ToastContext";

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const isEditing = !!task;
  const toast = useToast();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("O título da tarefa é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await updateTask(task.id, { title, description });
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        await createTask({ title, description, completed: false });
        toast.success("Tarefa criada com sucesso!");
        setTitle("");
        setDescription("");
      }
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="title"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Título
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError("");
          }}
          className={`border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 ${
            titleError
              ? "border-red-400 dark:border-red-400"
              : "border-zinc-200 dark:border-zinc-700"
          }`}
        />
        {titleError && (
          <p className="text-red-500 text-xs mt-0.5">{titleError}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Criar tarefa"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-zinc-200 dark:border-zinc-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
