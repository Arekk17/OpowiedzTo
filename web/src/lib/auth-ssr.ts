import { cookies } from "next/headers";
import type { User } from "@/types/user";

export async function getAuthUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) return null;

  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("[auth-ssr] No API URL configured");
    return null;
  }

  try {
    const cookieHeader = cookieStore.toString();

    let response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 401 && refreshToken) {
      console.log("[auth-ssr] Token expired, attempting refresh...");

      const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: { Cookie: cookieHeader },
      });

      if (refreshResponse.ok) {
        const newCookieHeader = refreshResponse.headers.get("set-cookie");

        if (newCookieHeader) {
          console.log(
            "[auth-ssr] Refresh successful, retrying /auth/me with new token"
          );

          response = await fetch(`${apiUrl}/auth/me`, {
            headers: { Cookie: newCookieHeader },
            cache: "no-store",
          });

          if (response.ok) {
            return await response.json();
          }
        }
      }

      console.log("[auth-ssr] Refresh failed or invalid");
    }

    return null;
  } catch (error) {
    console.error("[auth-ssr] Error fetching user:", error);
    return null;
  }
}
