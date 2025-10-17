import { parseSetCookieHeader } from "@/helpers/parse";

describe("parse", () => {
  describe("parseSetCookieHeader", () => {
    it("should parse single cookie", () => {
      const header = "sessionId=abc123; Path=/; HttpOnly";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual(["sessionId=abc123"]);
    });

    it("should parse multiple cookies", () => {
      const header =
        "sessionId=abc123; Path=/; HttpOnly, token=xyz789; Path=/; Secure";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual(["sessionId=abc123", "token=xyz789"]);
    });

    it("should handle cookies with spaces", () => {
      const header =
        " sessionId=abc123 ; Path=/; HttpOnly , token=xyz789 ; Path=/; Secure ";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual(["sessionId=abc123", "token=xyz789"]);
    });

    it("should filter out cookies without equals sign", () => {
      const header =
        "sessionId=abc123; Path=/; HttpOnly, invalidCookie, token=xyz789";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual(["sessionId=abc123", "token=xyz789"]);
    });

    it("should handle empty header", () => {
      const result = parseSetCookieHeader("");
      expect(result).toEqual([]);
    });

    it("should handle header with only invalid cookies", () => {
      const header = "invalidCookie1, invalidCookie2";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual([]);
    });

    it("should handle cookies with complex values", () => {
      const header =
        "user=john.doe@example.com; Path=/; HttpOnly, theme=dark; Path=/; Max-Age=3600";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual(["user=john.doe@example.com", "theme=dark"]);
    });

    it("should handle single cookie without attributes", () => {
      const header = "simple=value";
      const result = parseSetCookieHeader(header);

      expect(result).toEqual(["simple=value"]);
    });
  });
});
