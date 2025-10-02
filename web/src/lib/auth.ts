type ApiRequestOptions = RequestInit & {
  cookieHeader?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { cookieHeader, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...fetchOptions.headers,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers,
      ...(cookieHeader ? {} : { credentials: "include" }),
    }
  );

  if (response.ok) {
    return response.json();
  }

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        return apiRequest<T>(endpoint, options);
      } catch {
        throw new Error("Unauthorized");
      }
    } else if (cookieHeader) {
      try {
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: { Cookie: cookieHeader },
          }
        );

        if (refreshResponse.ok) {
          const setCookieHeader = refreshResponse.headers.get("set-cookie");
          const newCookieHeader = setCookieHeader || cookieHeader;
          return apiRequest<T>(endpoint, {
            ...options,
            cookieHeader: newCookieHeader,
          });
        }
      } catch {}
    }
  }

  throw new Error(`API Error: ${response.status}`);
}
