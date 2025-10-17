import * as Reports from "@/services/reports.service";
import { apiRequest } from "@/lib/auth";
import { REPORTS_ENDPOINTS } from "@/lib/config/api";
import type { CreateReportFormData } from "@/types/report";
import { ReportCategory } from "@/types/report";

jest.mock("@/lib/auth", () => ({ apiRequest: jest.fn() }));

describe("reports.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("reportPost", () => {
    it("should POST report data for post", async () => {
      const postId = "post123";
      const reportData: CreateReportFormData = {
        category: ReportCategory.SPAM,
        reason: "This is spam content",
      };

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Reports.reportPost(postId, reportData);

      expect(apiRequest).toHaveBeenCalledWith(
        REPORTS_ENDPOINTS.reportPost(postId),
        {
          method: "POST",
          body: JSON.stringify(reportData),
        },
      );
    });

    it("should handle report without reason", async () => {
      const postId = "post456";
      const reportData: CreateReportFormData = {
        category: ReportCategory.OFFENSIVE,
      };

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Reports.reportPost(postId, reportData);

      expect(apiRequest).toHaveBeenCalledWith(
        REPORTS_ENDPOINTS.reportPost(postId),
        {
          method: "POST",
          body: JSON.stringify(reportData),
        },
      );
    });
  });

  describe("reportComment", () => {
    it("should POST report data for comment", async () => {
      const commentId = "comment123";
      const reportData: CreateReportFormData = {
        category: ReportCategory.FALSE_INFO,
        reason: "Contains false information",
      };

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Reports.reportComment(commentId, reportData);

      expect(apiRequest).toHaveBeenCalledWith(
        REPORTS_ENDPOINTS.reportComment(commentId),
        {
          method: "POST",
          body: JSON.stringify(reportData),
        },
      );
    });

    it("should handle comment report with OTHER category", async () => {
      const commentId = "comment456";
      const reportData: CreateReportFormData = {
        category: ReportCategory.OTHER,
        reason: "Other violation",
      };

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Reports.reportComment(commentId, reportData);

      expect(apiRequest).toHaveBeenCalledWith(
        REPORTS_ENDPOINTS.reportComment(commentId),
        {
          method: "POST",
          body: JSON.stringify(reportData),
        },
      );
    });
  });

  describe("getPostReportCount", () => {
    it("should GET and return post report count", async () => {
      const postId = "post789";
      const mockResponse = { count: 5 };

      (apiRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await Reports.getPostReportCount(postId);

      expect(apiRequest).toHaveBeenCalledWith(
        REPORTS_ENDPOINTS.postReportCount(postId),
        { method: "GET" },
      );
      expect(result).toBe(5);
    });

    it("should return zero count when no reports", async () => {
      const postId = "post999";
      const mockResponse = { count: 0 };

      (apiRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await Reports.getPostReportCount(postId);

      expect(result).toBe(0);
    });
  });

  describe("getCommentReportCount", () => {
    it("should GET and return comment report count", async () => {
      const commentId = "comment789";
      const mockResponse = { count: 3 };

      (apiRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await Reports.getCommentReportCount(commentId);

      expect(apiRequest).toHaveBeenCalledWith(
        REPORTS_ENDPOINTS.commentReportCount(commentId),
        { method: "GET" },
      );
      expect(result).toBe(3);
    });

    it("should handle high report counts", async () => {
      const commentId = "comment999";
      const mockResponse = { count: 42 };

      (apiRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await Reports.getCommentReportCount(commentId);

      expect(result).toBe(42);
    });
  });

  describe("error handling", () => {
    it("should propagate API errors for reportPost", async () => {
      const postId = "post-error";
      const reportData: CreateReportFormData = {
        category: ReportCategory.INAPPROPRIATE,
      };
      const error = new Error("API Error");

      (apiRequest as jest.Mock).mockRejectedValueOnce(error);

      await expect(Reports.reportPost(postId, reportData)).rejects.toThrow(
        "API Error",
      );
    });

    it("should propagate API errors for getPostReportCount", async () => {
      const postId = "post-error";
      const error = new Error("Network Error");

      (apiRequest as jest.Mock).mockRejectedValueOnce(error);

      await expect(Reports.getPostReportCount(postId)).rejects.toThrow(
        "Network Error",
      );
    });
  });
});
