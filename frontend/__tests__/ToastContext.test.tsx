import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { ToastProvider, useToast } from "../app/context/ToastContext";

function ToastTrigger({ type }: { type: "success" | "error" | "info" }) {
  const toast = useToast();
  return (
    <button onClick={() => toast[type](`Mensagem de ${type}`)}>
      Disparar toast
    </button>
  );
}

describe("ToastContext", () => {
  it("useToast lança erro fora do provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ToastTrigger type="success" />)).toThrow(
      "useToast must be used within a ToastProvider",
    );

    consoleError.mockRestore();
  });

  it("toast.success exibe mensagem na tela", async () => {
    render(
      <ToastProvider>
        <ToastTrigger type="success" />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Disparar toast" }));
    expect(screen.getByText("Mensagem de success")).toBeInTheDocument();
  });

  it("toast.error exibe mensagem na tela", async () => {
    render(
      <ToastProvider>
        <ToastTrigger type="error" />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Disparar toast" }));
    expect(screen.getByText("Mensagem de error")).toBeInTheDocument();
  });

  it("clique no botão fechar remove o toast", async () => {
    render(
      <ToastProvider>
        <ToastTrigger type="success" />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Disparar toast" }));
    expect(screen.getByText("Mensagem de success")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByText("Mensagem de success")).not.toBeInTheDocument();
  });

  describe("remoção automática", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("toast some automaticamente após 3 segundos", async () => {
      render(
        <ToastProvider>
          <ToastTrigger type="success" />
        </ToastProvider>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Disparar toast" }));
      expect(screen.getByText("Mensagem de success")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.queryByText("Mensagem de success")).not.toBeInTheDocument();
    });
  });
});
