import { cookies } from "next/headers";
import type { User } from "@/types/user";

export async function getAuthUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) return null;

  // Server-side: użyj API_URL jeśli dostępna (Docker), inaczej NEXT_PUBLIC_API_URL
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("[auth-ssr] No API URL configured");
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 401) {
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: { Cookie: cookieStore.toString() },
      });

      if (refreshResponse.ok) {
        const userResponse = await fetch(`${apiUrl}/auth/me`, {
          headers: { Cookie: cookieStore.toString() },
        });
        return userResponse.ok ? await userResponse.json() : null;
      }
    }

    return null;
  } catch (error) {
    console.error("[auth-ssr] Error fetching user:", error);
    return null;
  }
}
