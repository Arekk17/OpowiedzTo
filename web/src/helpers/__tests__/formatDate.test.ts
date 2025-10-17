// web/src/helpers/__tests__/formatDate.test.ts
import { formatDateTime, formatRelativeTime } from "@/helpers/formatDate";

// Mock całego modułu date-fns
jest.mock("date-fns", () => ({
  format: jest.fn((date, pattern) => {
    if (pattern === "dd.MM.yyyy HH:mm") {
      return "15.10.2025 22:05";
    }
    return "formatted-date";
  }),
  formatDistanceToNow: jest.fn(() => "2 godziny temu"),
}));

jest.mock("date-fns/locale", () => ({
  pl: "pl-locale",
}));

describe("formatDate", () => {
  describe("formatDateTime", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should format valid date string", () => {
      const result = formatDateTime("2025-10-15T22:05:00Z");
      expect(result).toBe("15.10.2025 22:05");
    });

    it("should format Date object", () => {
      const date = new Date("2025-10-15T22:05:00Z");
      const result = formatDateTime(date);
      expect(result).toBe("15.10.2025 22:05");
    });

    it("should return empty string for null/undefined", () => {
      expect(formatDateTime(null)).toBe("");
      expect(formatDateTime(undefined)).toBe("");
    });

    it("should handle invalid date and return string representation", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = formatDateTime("invalid-date");

      expect(consoleSpy).toHaveBeenCalledWith("Invalid date:", "invalid-date");
      expect(result).toBe("invalid-date");

      consoleSpy.mockRestore();
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should format valid date string", () => {
      const result = formatRelativeTime("2025-10-15T22:05:00Z");
      expect(result).toBe("2 godziny temu");
    });

    it("should format Date object", () => {
      const date = new Date("2025-10-15T22:05:00Z");
      const result = formatRelativeTime(date);
      expect(result).toBe("2 godziny temu");
    });

    it("should return empty string for null/undefined", () => {
      expect(formatRelativeTime(null)).toBe("");
      expect(formatRelativeTime(undefined)).toBe("");
    });

    it("should handle invalid date and return string representation", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = formatRelativeTime("invalid-date");

      expect(consoleSpy).toHaveBeenCalledWith("Invalid date:", "invalid-date");
      expect(result).toBe("invalid-date");

      consoleSpy.mockRestore();
    });
  });
});
