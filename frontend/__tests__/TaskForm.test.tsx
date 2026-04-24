import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TaskForm } from "../app/components/TaskForm";
import * as api from "../lib/api";

vi.mock("../lib/api", () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("../app/context/ToastContext", () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
    info: vi.fn(),
  }),
}));

const mockTask = {
  id: "1",
  title: "Task existente",
  description: "Descrição existente",
  completed: false,
  createdAt: "2024-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TaskForm — create mode", () => {
  it("renders the title field and the Create task button", () => {
    render(<TaskForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create task" }),
    ).toBeInTheDocument();
  });

  it("displays an error message when submitting without a title", async () => {
    render(<TaskForm onSuccess={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));
    expect(screen.getByText("Task title is required.")).toBeInTheDocument();
  });

  it("clears the error when typing in the title field", async () => {
    render(<TaskForm onSuccess={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));
    expect(screen.getByText("Task title is required.")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Title"), "New task");
    expect(
      screen.queryByText("Task title is required."),
    ).not.toBeInTheDocument();
  });

  it("calls createTask and onSuccess when submitting with a valid title", async () => {
    const onSuccess = vi.fn();
    vi.mocked(api.createTask).mockResolvedValue(mockTask);

    render(<TaskForm onSuccess={onSuccess} />);
    await userEvent.type(screen.getByLabelText("Title"), "New task");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith({
        title: "New task",
        description: "",
        completed: false,
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Tarefa criada com sucesso!",
      );
    });
  });

  it("displays the Cancel button and calls onCancel when clicked", async () => {
    const onCancel = vi.fn();
    render(<TaskForm onSuccess={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });
});

describe("TaskForm — edit mode", () => {
  it("pre-fills the fields with the task data", () => {
    render(<TaskForm task={mockTask} onSuccess={vi.fn()} />);
    expect(screen.getByDisplayValue("Existing task")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing description"),
    ).toBeInTheDocument();
  });

  it("button shows Save changes", () => {
    render(<TaskForm task={mockTask} onSuccess={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("calls updateTask when submitting", async () => {
    const onSuccess = vi.fn();
    vi.mocked(api.updateTask).mockResolvedValue(mockTask);

    render(<TaskForm task={mockTask} onSuccess={onSuccess} />);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith("1", {
        title: "Existing task",
        description: "Existing description",
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Tarefa atualizada com sucesso!",
      );
    });
  });
});
