import { apiRequest } from "../auth";
import { ApiError, ERROR_MESSAGES } from "@/types/errors";

describe("ApiError", () => {
  it("should create error with correct properties", () => {
    const error = new ApiError("Test message", 401, "Unauthorized");
    expect(error.message).toBe("Test message");
    expect(error.statusCode).toBe(401);
    expect(error.error).toBe("Unauthorized");
    expect(error.name).toBe("ApiError");
  });
});

describe("apiRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  it("should return data on successful response", async () => {
    const mockData = { id: 1, name: "Test" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await apiRequest("/test");

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("should throw ApiError with backend message on 401", async () => {
    const errorResponse = {
      message: "Nieprawidłowy email lub hasło",
      error: "Unauthorized",
      statusCode: 401,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });

    await expect(
      apiRequest("/auth/login", { skipRefreshOn401: true })
    ).rejects.toThrow(ApiError);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });

    try {
      await apiRequest("/auth/login", { skipRefreshOn401: true });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe("Nieprawidłowy email lub hasło");
      expect((error as ApiError).statusCode).toBe(401);
    }
  });

  it("should use ERROR_MESSAGES fallback when backend returns no message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn().mockRejectedValueOnce(new Error("Not JSON")),
    });

    try {
      await apiRequest("/test", { skipRefreshOn401: true });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe(ERROR_MESSAGES[401]);
    }
  });

  it("should handle 409 conflict error", async () => {
    const errorResponse = {
      message: "Email już istnieje w systemie",
      error: "Conflict",
      statusCode: 409,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });

    try {
      await apiRequest("/auth/register");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe("Email już istnieje w systemie");
      expect((error as ApiError).statusCode).toBe(409);
    }
  });

  it("should handle 500 server error", async () => {
    const errorResponse = {
      message: "Internal server error",
      error: "Internal Server Error",
      statusCode: 500,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });

    try {
      await apiRequest("/test");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).statusCode).toBe(500);
    }
  });

  it("should include credentials when no cookieHeader is provided", async () => {
    const mockData = { success: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await apiRequest("/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/test",
      expect.objectContaining({
        credentials: "include",
      })
    );
  });

  it("should not include credentials when cookieHeader is provided", async () => {
    const mockData = { success: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await apiRequest("/test", { cookieHeader: "refreshToken=abc123" });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Cookie: "refreshToken=abc123",
        }),
      })
    );
    expect((global.fetch as jest.Mock).mock.calls[0][1]).not.toHaveProperty(
      "credentials"
    );
  });
});
