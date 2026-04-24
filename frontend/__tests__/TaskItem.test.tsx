import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TaskItem } from "../app/components/TaskItem";
import * as api from "../lib/api";

vi.mock("../lib/api", () => ({
  deleteTask: vi.fn(),
  updateTask: vi.fn(),
  createTask: vi.fn(),
}));

vi.mock("../app/context/ToastContext", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

const mockTask = {
  id: "1",
  title: "Minha task",
  description: "Descrição da task",
  completed: false,
  createdAt: "2024-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TaskItem — renderização", () => {
  it("renderiza título e descrição", () => {
    render(<TaskItem task={mockTask} onUpdate={vi.fn()} />);
    expect(screen.getByText("Minha task")).toBeInTheDocument();
    expect(screen.getByText("Descrição da task")).toBeInTheDocument();
  });

  it("aplica line-through no título quando completed é true", () => {
    render(<TaskItem task={{ ...mockTask, completed: true }} onUpdate={vi.fn()} />);
    const title = screen.getByText("Minha task");
    expect(title.className).toContain("line-through");
  });

  it("checkbox fica marcado quando completed é true", () => {
    render(<TaskItem task={{ ...mockTask, completed: true }} onUpdate={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("checkbox fica desmarcado quando completed é false", () => {
    render(<TaskItem task={mockTask} onUpdate={vi.fn()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});

describe("TaskItem — ações", () => {
  it("clique no checkbox chama updateTask com completed invertido", async () => {
    vi.mocked(api.updateTask).mockResolvedValue({ ...mockTask, completed: true });
    const onUpdate = vi.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith("1", { completed: true });
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it("clique no botão de deletar chama deleteTask e onUpdate", async () => {
    vi.mocked(api.deleteTask).mockResolvedValue(undefined);
    const onUpdate = vi.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole("button", { name: "Deletar task" }));

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith("1");
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it("clique no botão de editar exibe o formulário com dados da task", async () => {
    render(<TaskItem task={mockTask} onUpdate={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Editar task" }));
    expect(screen.getByDisplayValue("Minha task")).toBeInTheDocument();
  });
});
