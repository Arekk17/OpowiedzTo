const OLD_ENV = process.env;
const realFetch = global.fetch;

describe("getAuthUser (SSR)", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, API_URL: "http://api" };
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env = OLD_ENV;
    global.fetch = realFetch as typeof fetch;
    jest.clearAllMocks();
  });

  it("returns null when no refreshToken cookie", async () => {
    jest.doMock("next/headers", () => ({
      cookies: async () => ({
        get: () => undefined,
        toString: (): string => "",
      }),
    }));

    const { getAuthUser } = await import("@/lib/auth-ssr");
    const user = await getAuthUser();
    expect(user).toBeNull();
  });

  it("401 from /auth/me -> refresh -> retry with set-cookie returns user", async () => {
    jest.doMock("next/headers", () => ({
      cookies: async () => ({
        get: () => ({ value: "x" }),
        toString: (): string => "refreshToken=x",
      }),
    }));

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(new Response("", { status: 401 }))
      .mockResolvedValueOnce(
        new Response("", {
          status: 200,
          headers: { "set-cookie": "refreshToken=y" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "u1" }), { status: 200 })
      );

    const { getAuthUser } = await import("@/lib/auth-ssr");
    const user = await getAuthUser();
    expect(user).toEqual({ id: "u1" });
  });
});
