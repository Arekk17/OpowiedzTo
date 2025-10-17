// web/src/helpers/__tests__/generateSlug.test.ts
import { generateSlug, getPostUrl } from "@/helpers/generateSlug";

describe("generateSlug", () => {
  describe("generateSlug", () => {
    it("should convert text to lowercase slug", () => {
      const result = generateSlug("Hello World");
      expect(result).toBe("hello-world");
    });

    it("should remove special characters", () => {
      const result = generateSlug("Hello, World! @#$%");
      expect(result).toBe("hello-world");
    });

    it("should remove accents", () => {
      const result = generateSlug("Café naïveté");
      expect(result).toBe("cafe-naivete");
    });

    it("should handle multiple spaces", () => {
      const result = generateSlug("Hello    World");
      expect(result).toBe("hello-world");
    });

    it("should remove leading/trailing hyphens", () => {
      const result = generateSlug("---Hello World---");
      expect(result).toBe("hello-world");
    });

    it("should limit to 100 characters", () => {
      const longText = "a".repeat(150);
      const result = generateSlug(longText);
      expect(result).toHaveLength(100);
      expect(result).toBe("a".repeat(100));
    });

    it("should handle empty string", () => {
      const result = generateSlug("");
      expect(result).toBe("");
    });

    it("should handle numbers", () => {
      const result = generateSlug("Post 123");
      expect(result).toBe("post-123");
    });

    it("should handle mixed case", () => {
      const result = generateSlug("JavaScript TypeScript");
      expect(result).toBe("javascript-typescript");
    });
  });

  describe("getPostUrl", () => {
    it("should generate post URL with slug", () => {
      const result = getPostUrl("post123", "My Amazing Post");
      expect(result).toBe("/history/post123/my-amazing-post");
    });

    it("should handle special characters in title", () => {
      const result = getPostUrl("post456", "Café & JavaScript!");
      expect(result).toBe("/history/post456/cafe-javascript");
    });

    it("should handle empty title", () => {
      const result = getPostUrl("post789", "");
      expect(result).toBe("/history/post789/");
    });

    it("should limit slug length", () => {
      const longTitle = "a".repeat(150);
      const result = getPostUrl("post999", longTitle);
      expect(result).toBe(`/history/post999/${"a".repeat(100)}`);
    });
  });
});
