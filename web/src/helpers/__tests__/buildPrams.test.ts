import {
  buildParams,
  buildQueryParams,
  buildCursorParams,
  updateSearchParams,
} from "@/helpers/buildParams";
import type { PostFiltersData } from "@/types/post";

describe("buildParams", () => {
  describe("buildParams", () => {
    it("should build URLSearchParams with all provided filters", () => {
      const filters = {
        page: 2,
        limit: 20,
        cursor: "abc123",
        tag: "javascript",
        authorId: "user123",
        sortBy: "newest",
      };

      const result = buildParams(filters);

      expect(result.get("page")).toBe("2");
      expect(result.get("limit")).toBe("20");
      expect(result.get("cursor")).toBe("abc123");
      expect(result.get("tag")).toBe("javascript");
      expect(result.get("authorId")).toBe("user123");
      expect(result.get("sortBy")).toBe("newest");
    });

    it("should skip undefined and empty values", () => {
      const filters = {
        page: 1,
        limit: undefined,
        cursor: "",
        tag: "   ",
        authorId: undefined,
        sortBy: "popular",
      };

      const result = buildParams(filters);

      expect(result.get("page")).toBe("1");
      expect(result.get("limit")).toBeNull();
      expect(result.get("cursor")).toBeNull();
      expect(result.get("tag")).toBeNull();
      expect(result.get("authorId")).toBeNull();
      expect(result.get("sortBy")).toBe("popular");
    });

    it("should handle empty object", () => {
      const result = buildParams({});

      expect(result.toString()).toBe("");
    });
  });

  describe("buildQueryParams", () => {
    it("should build params with defaults", () => {
      const filters: PostFiltersData = {
        page: 1,
        limit: 10,
      };

      const result = buildQueryParams(filters);

      expect(result.get("page")).toBe("1");
      expect(result.get("limit")).toBe("10");
    });

    it("should include optional filters", () => {
      const filters: PostFiltersData = {
        page: 1,
        limit: 10,
        authorId: "user456",
        tag: "react",
      };

      const result = buildQueryParams(filters);

      expect(result.get("authorId")).toBe("user456");
      expect(result.get("tag")).toBe("react");
    });
  });

  describe("buildCursorParams", () => {
    it("should build cursor params", () => {
      const filters = {
        cursor: "xyz789",
        limit: 15,
        tag: "typescript",
        authorId: "user789",
        sortBy: "most_commented",
      };

      const result = buildCursorParams(filters);

      expect(result.get("cursor")).toBe("xyz789");
      expect(result.get("limit")).toBe("15");
      expect(result.get("tag")).toBe("typescript");
      expect(result.get("authorId")).toBe("user789");
      expect(result.get("sortBy")).toBe("most_commented");
    });
  });

  describe("updateSearchParams", () => {
    it("should update existing params", () => {
      const sp = new URLSearchParams("page=1&tag=react&authorId=user1");
      const patch = { tag: "vue", authorId: "user2" };

      const result = updateSearchParams(sp, patch);

      expect(result.get("tag")).toBe("vue");
      expect(result.get("authorId")).toBe("user2");
      expect(result.get("page")).toBeNull(); // Should be deleted
    });

    it("should delete params with null/undefined/empty values", () => {
      const sp = new URLSearchParams("page=1&tag=react&authorId=user1");
      const patch = { tag: null, authorId: undefined, sortBy: "" };

      const result = updateSearchParams(sp, patch);

      expect(result.get("tag")).toBeNull();
      expect(result.get("authorId")).toBeNull();
      expect(result.get("sortBy")).toBeNull();
      expect(result.get("page")).toBeNull();
    });

    it("should handle empty patch", () => {
      const sp = new URLSearchParams("page=1&tag=react");
      const result = updateSearchParams(sp, {});

      expect(result.get("page")).toBeNull();
      expect(result.get("tag")).toBe("react");
    });
  });
});
