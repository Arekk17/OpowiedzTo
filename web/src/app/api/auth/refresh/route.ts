import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("[API] Refresh token request started");

  try {
    const apiUrl =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001";
    console.log("[API] Backend URL:", apiUrl);

    const cookieHeader = request.headers.get("cookie");
    console.log("[API] Cookie header:", cookieHeader);

    if (!apiUrl) {
      console.error("[API] NEXT_PUBLIC_API_URL not set");
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    console.log("[API] Calling backend refresh endpoint...");
    const response = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader || "",
      },
    });

    console.log("[API] Backend response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Backend error response:", errorText);
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const data = await response.json();
    console.log("[API] Backend data:", data);

    const setCookieHeader = response.headers.get("set-cookie");
    console.log("[API] Set-Cookie header from backend:", setCookieHeader);

    const nextResponse = NextResponse.json({
      success: true,
      ...data,
    });

    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    console.log("[API] Refresh successful");
    return nextResponse;
  } catch (error) {
    console.error("[API] Refresh error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
