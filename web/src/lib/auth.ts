import { ApiError, ApiErrorResponse, ERROR_MESSAGES } from "@/types/errors";

type ApiRequestOptions = RequestInit & {
  cookieHeader?: string;
  skipRefreshOn401?: boolean;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { cookieHeader, skipRefreshOn401, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...fetchOptions.headers,
  };
  const apiUrl =
    typeof window === "undefined"
      ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...fetchOptions,
    headers,
    ...(cookieHeader ? {} : { credentials: "include" }),
  });

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text || text.length === 0) {
      return undefined as T;
    }
    return JSON.parse(text);
  }

  let errorData: ApiErrorResponse | null = null;
  try {
    errorData = await response.json();
  } catch {}

  if (response.status === 401) {
    if (skipRefreshOn401) {
      throw new ApiError(
        errorData?.message || ERROR_MESSAGES[401] || "Unauthorized",
        401,
        errorData?.error || "Unauthorized"
      );
    }

    if (typeof window !== "undefined") {
      try {
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.ok) {
          return apiRequest<T>(endpoint, {
            ...options,
            skipRefreshOn401: true,
          });
        }
      } catch {
        throw new ApiError(
          errorData?.message || ERROR_MESSAGES[401] || "Unauthorized",
          401,
          errorData?.error || "Unauthorized"
        );
      }
    }

    throw new ApiError(
      errorData?.message ||
        ERROR_MESSAGES[response.status] ||
        `API Error: ${response.status}`,
      response.status,
      errorData?.error || "Error"
    );
  }

  throw new ApiError(
    errorData?.message ||
      ERROR_MESSAGES[response.status] ||
      `API Error: ${response.status}`,
    response.status,
    errorData?.error || "Error"
  );
}
