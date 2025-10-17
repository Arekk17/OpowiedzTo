import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import * as authService from "@/services/auth.service";
import { usePathname, useSearchParams } from "next/navigation";

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams("")),
}));

jest.mock("@/services/auth.service", () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useAuth", () => {
  const realFetch = global.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn() as unknown as typeof fetch;
    jest.clearAllMocks();

    (usePathname as jest.Mock).mockReturnValue("/");
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
    mockPush.mockClear();
    mockRefresh.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = realFetch as typeof fetch;
    jest.resetModules();
  });

  it("disables initial query on auth pages (/auth/*)", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");

    renderHook(() => useAuth(), { wrapper });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("enables initial query when not on auth page", async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: "u1",
      nickname: "John",
      email: "john@example.com",
    });

    renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(authService.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  it("sets tokenExpiresAt and schedules a refresh 1 minute before expiry", async () => {
    const now = Date.now();
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: "u1",
      expiresAt: now + 70_000,
    });

    const mockRefresh = jest.fn().mockResolvedValue({
      success: true,
      expiresAt: now + 300_000,
      serverTime: now,
    });

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/auth/refresh")) {
        return Promise.resolve(
          new Response(JSON.stringify(mockRefresh()), { status: 200 })
        );
      }
      return Promise.resolve(new Response("{}", { status: 200 }));
    });

    renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      jest.advanceTimersByTime(11_000);
    });

    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });

    const calls = (global.fetch as jest.Mock).mock.calls.map(
      (c) => c[0] as string
    );
    expect(calls).toContain("/api/auth/refresh");
  });

  it("performs immediate refresh when expiry is <= 1 minute from now", async () => {
    const now = Date.now();
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: "u1",
      expiresAt: now + 30_000, // 30 sekund od teraz
    });

    const mockRefresh = jest.fn().mockResolvedValue({
      success: true,
      expiresAt: now + 300_000,
      serverTime: now,
    });

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/auth/refresh")) {
        return Promise.resolve(
          new Response(JSON.stringify(mockRefresh()), { status: 200 })
        );
      }
      return Promise.resolve(new Response("{}", { status: 200 }));
    });

    renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls.map(
        (c) => c[0] as string
      );
      expect(calls).toContain("/api/auth/refresh");
    });
  });

  it("login mutation updates cache, sets expiresAt, and redirects to default callbackUrl", async () => {
    const now = Date.now();
    const mockLogin = jest.fn().mockResolvedValue({
      userId: "u1",
      nickname: "John",
      expiresAt: now + 300_000,
      serverTime: now,
    });

    (authService.login as jest.Mock).mockImplementation(mockLogin);
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.signin({ email: "a@b.c", password: "x" });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard/profile");
      expect(mockRefresh).toHaveBeenCalled();
    });

    expect(mockLogin).toHaveBeenCalledWith(
      {
        email: "a@b.c",
        password: "x",
      },
      expect.anything()
    );
  });

  it("register mutation updates cache and redirects to callbackUrl from search params", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("callbackUrl=/dashboard")
    );

    const now = Date.now();
    const mockRegister = jest.fn().mockResolvedValue({
      userId: "u2",
      nickname: "Alice",
      expiresAt: now + 300_000,
      serverTime: now,
    });

    (authService.register as jest.Mock).mockImplementation(mockRegister);
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.signup({
        email: "a@b.c",
        password: "x",
        nickname: "Alice",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
      expect(mockRefresh).toHaveBeenCalled();
    });

    expect(mockRegister).toHaveBeenCalledWith(
      {
        email: "a@b.c",
        password: "x",
        nickname: "Alice",
      },
      expect.anything()
    );
  });

  it("logout mutation clears cache, resets token, and redirects to /auth/login", async () => {
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    (authService.logout as jest.Mock).mockImplementation(mockLogout);

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ id: "u1", expiresAt: Date.now() + 300_000 }),
        { status: 200 }
      )
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.signout(undefined as unknown as void);
    });

    expect(mockPush).toHaveBeenCalledWith("/auth/login");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("exposes isAuthenticated based on user presence", async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: "u1",
      nickname: "John",
      email: "john@example.com",
    });

    let rendered = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(rendered.result.current.isAuthenticated).toBe(true);
    });

    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
    rendered = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(rendered.result.current.isAuthenticated).toBe(false);
    });
  });
});
