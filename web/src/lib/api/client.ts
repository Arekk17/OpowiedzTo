import { API_CONFIG, AUTH_ENDPOINTS } from "../config/api";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(
        `${API_CONFIG.baseURL}${AUTH_ENDPOINTS.refreshToken}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Refresh failed");
    } catch {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth/")
      ) {
        window.location.assign("/auth/login");
      }
      throw new ApiError("Sesja wygasła", 401);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

type FetchOptions = RequestInit & {
  cookieHeader?: string;
};

async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { cookieHeader, ...fetchOptions } = options;

  const headers: HeadersInit = {
    ...API_CONFIG.headers,
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...fetchOptions.headers,
  };

  const res = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (res.ok) {
    const contentType = res.headers.get("content-type");
    return contentType?.includes("application/json") ? res.json() : ({} as T);
  }

  const errorData = await res.json().catch(() => ({}));
  const message = errorData.message || errorData.error || "Wystąpił błąd";

  const shouldRetry =
    res.status === 401 &&
    !cookieHeader &&
    typeof window !== "undefined" &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/register") &&
    !endpoint.includes("/auth/me");

  if (shouldRetry) {
    await refreshToken();
    return request<T>(endpoint, options);
  }

  throw new ApiError(message, res.status);
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T> => {
    const isFormData = data instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData
        ? options?.headers
        : { "Content-Type": "application/json", ...options?.headers },
    });
  },

  put: <T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", ...options?.headers },
    }),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", ...options?.headers },
    }),

  delete: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: "DELETE" }),

  uploadFile: <T>(
    endpoint: string,
    file: File,
    options?: FetchOptions
  ): Promise<T> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<T>(endpoint, formData, options);
  },
};
