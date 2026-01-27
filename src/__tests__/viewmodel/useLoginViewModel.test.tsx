import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useLoginViewModel } from "../../viewmodel/useLoginViewModel";
import { authService } from "../../model/services/AuthService";
import { AuthContext } from "../../contexts/AuthContextBase";
import { router } from "expo-router";

/* =========================
   MOCKS
========================= */

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("../../model/services/AuthService", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: jest.fn(),
  },
}));

/* =========================
   WRAPPER (SEGURO)
========================= */

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    AuthContext.Provider,
    { value: {} as any },
    children
  );


/* =========================
   TESTES
========================= */

describe("useLoginViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe(null);
    expect(result.current.state.isAuthenticated).toBe(false);
  });

  it("should login successfully", async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    let success!: boolean;

    await act(async () => {
      success = await result.current.actions.login(
        "teste@email.com",
        "123456"
      );
    });

    // credenciais fixas do ViewModel
    expect(authService.login).toHaveBeenCalledWith(
      "promotor2@test.com",
      "12345678"
    );

    expect(success).toBe(true);
    expect(result.current.state.isAuthenticated).toBe(true);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe(null);
  });

  it("should set error when login fails", async () => {
    (authService.login as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    let success!: boolean;

    await act(async () => {
      success = await result.current.actions.login(
        "teste@email.com",
        "senhaErrada"
      );
    });

    expect(success).toBe(false);
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe(
      "Erro inesperado ao realizar login"
    );
  });

  it("should clear error", async () => {
    (authService.login as jest.Mock).mockRejectedValueOnce(
      new Error("Erro qualquer")
    );

    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    await act(async () => {
      await result.current.actions.login("a", "b");
    });

    expect(result.current.state.error).not.toBe(null);

    act(() => {
      result.current.actions.clearError();
    });

    expect(result.current.state.error).toBe(null);
  });

  it("should login and navigate to dashboard", async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    await act(async () => {
      await result.current.actions.loginAndNavigate(
        "teste@email.com",
        "123456"
      );
    });

    expect(router.replace).toHaveBeenCalledWith("/DashboardScreen");
  });

  it("should logout successfully", async () => {
    (authService.logout as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    await act(async () => {
      await result.current.actions.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.state.isAuthenticated).toBe(false);
  });

  it("should check authentication status", async () => {
    (authService.isAuthenticated as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLoginViewModel(), { wrapper });

    await act(async () => {
      await result.current.actions.checkAuthStatus();
    });

    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(result.current.state.isAuthenticated).toBe(true);
  });
});
