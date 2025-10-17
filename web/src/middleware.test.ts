import middleware from "./middleware";
import { NextRequest } from "next/server";

jest.mock("next/server", () => {
  return {
    NextResponse: {
      redirect: (url: URL) => ({
        status: 307,
        headers: new Map([["location", url.toString()]]),
      }),
      next: () => ({
        status: 200,
        headers: new Map(),
      }),
    },
  };
});

interface MockRequestCookie {
  name: string;
  value: string;
}

function makeReq(
  path: string,
  cookies: Record<string, string> = {},
): NextRequest {
  return {
    nextUrl: {
      pathname: path,
      origin: "https://example.org",
      searchParams: new URLSearchParams(),
      toString: () => `https://example.org${path}`,
    } as URL,
    url: `https://example.org${path}`,
    cookies: {
      get: (key: string): MockRequestCookie | undefined => {
        const value = cookies[key];
        return value ? { name: key, value } : undefined;
      },
    },
  } as NextRequest;
}

describe("middleware", () => {
  it("redirects to login on protected route without refreshToken", () => {
    const res = middleware(makeReq("/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain(
      "/auth/login?callbackUrl=%2Fdashboard",
    );
  });

  it("redirects from /auth/* to /dashboard when there is refreshToken", () => {
    const res = middleware(makeReq("/auth/login", { refreshToken: "x" }));
    expect(res.headers.get("location")).toBe("https://example.org/dashboard");
  });

  it("passes public routes", () => {
    const res = middleware(makeReq("/"));
    expect(res.status).toBe(200);
  });
});
