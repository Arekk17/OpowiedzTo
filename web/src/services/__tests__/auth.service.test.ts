import * as AuthService from "@/services/auth.service";
import { apiRequest } from "@/lib/auth";
import { AUTH_ENDPOINTS } from "@/lib/config/api";

jest.mock("@/lib/auth", () => ({ apiRequest: jest.fn() }));

describe("authService", () => {
  it("login: POST from body and skipRefreshOn401: true", async () => {
    (apiRequest as jest.Mock).mockResolvedValue({});
    await AuthService.login({ email: "a@b.c", password: "x" });
    expect(apiRequest).toHaveBeenCalledWith(AUTH_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify({ email: "a@b.c", password: "x" }),
      skipRefreshOn401: true,
    });
  });
  it("getCurrentUser: bez skipRefreshOn401", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ id: "1" });
    await AuthService.getCurrentUser();
    expect(apiRequest).toHaveBeenCalledWith(AUTH_ENDPOINTS.me);
  });
  it("logout: POST bez body", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ message: "ok" });
    await AuthService.logout();
    expect(apiRequest).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
  });

  it("propaguje błąd z apiRequest", async () => {
    (apiRequest as jest.Mock).mockRejectedValueOnce(new Error("401"));
    await expect(AuthService.refreshToken()).rejects.toThrow("401");
  });
});
