import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import * as authService from "@/services/auth.service";
import { ApiError } from "@/types/errors";

jest.mock("@/services/auth.service");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock cookie check
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "refreshToken=test",
    });
  });

  it("should expose signinError when login fails", async () => {
    const mockError = new ApiError(
      "Nieprawidłowy email lub hasło",
      401,
      "Unauthorized"
    );
    (authService.login as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.signin({ email: "test@test.com", password: "wrong" });

    await waitFor(() => {
      expect(result.current.signinError).toBeDefined();
      expect(result.current.signinError?.message).toBe(
        "Nieprawidłowy email lub hasło"
      );
    });
  });

  it("should expose signupError when register fails", async () => {
    const mockError = new ApiError(
      "Email już istnieje w systemie",
      409,
      "Conflict"
    );
    (authService.register as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.signup({
      email: "existing@test.com",
      password: "pass123",
      nickname: "test",
    });

    await waitFor(() => {
      expect(result.current.signupError).toBeDefined();
      expect(result.current.signupError?.message).toBe(
        "Email już istnieje w systemie"
      );
    });
  });

  it("should clear signinError on successful login", async () => {
    const mockResponse = {
      accessToken: "token123",
      userId: "user1",
      nickname: "testuser",
      expiresAt: Date.now() + 900000,
    };

    (authService.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.signin({ email: "test@test.com", password: "correct" });

    await waitFor(() => {
      expect(result.current.isSigningIn).toBe(false);
      expect(result.current.signinError).toBeNull();
    });
  });

  it("should set isSigningIn to true during login", async () => {
    (authService.login as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                accessToken: "token",
                userId: "1",
                nickname: "user",
                expiresAt: Date.now() + 900000,
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.signin({ email: "test@test.com", password: "pass" });

    // Powinna być true zaraz po wywołaniu
    await waitFor(() => {
      expect(result.current.isSigningIn).toBe(true);
    });
  });

  it("should set isSigningUp to true during registration", async () => {
    (authService.register as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                accessToken: "token",
                userId: "1",
                nickname: "user",
                expiresAt: Date.now() + 900000,
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.signup({
      email: "new@test.com",
      password: "pass123",
      nickname: "newuser",
    });

    await waitFor(() => {
      expect(result.current.isSigningUp).toBe(true);
    });
  });
});


