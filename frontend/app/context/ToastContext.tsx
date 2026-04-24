"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3000;

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-500",
  info: "bg-zinc-700",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onRemove, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm text-white shadow-lg min-w-64 max-w-sm animate-fade-in ${typeStyles[toast.type]}`}
    >
      <span>{toast.message}</span>
      <button
        onClick={onRemove}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const value: ToastContextValue = {
    success: (message) => add(message, "success"),
    error: (message) => add(message, "error"),
    info: (message) => add(message, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => remove(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
