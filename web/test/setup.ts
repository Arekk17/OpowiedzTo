import "@testing-library/jest-dom";

global.Response = class Response {
  status: number;
  statusText: string;
  headers: Headers;
  body: string | null;
  ok: boolean;

  constructor(body?: string | null, init?: ResponseInit) {
    this.status = init?.status ?? 200;
    this.statusText = init?.statusText ?? "OK";
    this.headers = new Headers(init?.headers);
    this.body = body ?? null;
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    if (!this.body) {
      throw new Error("Response body is empty");
    }
    return JSON.parse(this.body);
  }

  async text() {
    return this.body ?? "";
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }
} as unknown as typeof Response;

global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
