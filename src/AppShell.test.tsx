import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import AppShell from "./AppShell";

beforeEach(() => {
  localStorage.clear();
});

function renderShell(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <AppShell>
          <div />
        </AppShell>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AppShell nav active class", () => {
  it('adds "active" on Home for /', async () => {
    renderShell("/");
    await waitFor(() => {
      expect(screen.getByText("Home").closest("li")).toHaveClass("active");
    });
    expect(screen.getByText("Home")).toHaveClass("active");
  });

  it('adds "active" on Sign in for /login and not on Home', async () => {
    renderShell("/login");
    await waitFor(() => {
      expect(screen.getByText("Sign in").closest("li")).toHaveClass("active");
    });
    expect(screen.getByText("Sign in")).toHaveClass("active");
    expect(screen.getByText("Home").closest("li")).not.toHaveClass("active");
    expect(screen.getByText("Home")).not.toHaveClass("active");
  });

  it('adds "active" on Sign up for /register', async () => {
    renderShell("/register");
    await waitFor(() => {
      expect(screen.getByText("Sign up").closest("li")).toHaveClass("active");
    });
    expect(screen.getByText("Sign up")).toHaveClass("active");
  });
});
