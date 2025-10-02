import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const setCookieHeader = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json({ success: true });

    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
