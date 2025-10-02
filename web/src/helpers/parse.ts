export function parseSetCookieHeader(setCookieHeader: string): string[] {
  return setCookieHeader
    .split(",")
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie.includes("="))
    .map((cookie) => cookie.split(";")[0].trim());
}
