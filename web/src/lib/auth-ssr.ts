import { cookies } from "next/headers";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 401) {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: { Cookie: cookieStore.toString() },
        }
      );

      if (refreshResponse.ok) {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { headers: { Cookie: cookieStore.toString() } }
        );
        return userResponse.ok ? await userResponse.json() : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}
