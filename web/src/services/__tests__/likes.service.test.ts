import * as Likes from "@/services/likes.service";
import { apiRequest } from "@/lib/auth";
import { LIKES_ENDPOINTS } from "@/lib/config/api";

jest.mock("@/lib/auth", () => ({ apiRequest: jest.fn() }));

describe("likes.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("likePost", () => {
    it("should POST like request for post", async () => {
      const postId = "post123";

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Likes.likePost(postId);

      expect(apiRequest).toHaveBeenCalledWith(LIKES_ENDPOINTS.like(postId), {
        method: "POST",
      });
    });

    it("should handle like request for different post", async () => {
      const postId = "post456";

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Likes.likePost(postId);

      expect(apiRequest).toHaveBeenCalledWith(LIKES_ENDPOINTS.like(postId), {
        method: "POST",
      });
    });
  });

  describe("unlikePost", () => {
    it("should DELETE unlike request for post", async () => {
      const postId = "post789";

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Likes.unlikePost(postId);

      expect(apiRequest).toHaveBeenCalledWith(LIKES_ENDPOINTS.unlike(postId), {
        method: "DELETE",
      });
    });

    it("should handle unlike request for different post", async () => {
      const postId = "post999";

      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await Likes.unlikePost(postId);

      expect(apiRequest).toHaveBeenCalledWith(LIKES_ENDPOINTS.unlike(postId), {
        method: "DELETE",
      });
    });
  });

  describe("error handling", () => {
    it("should propagate API errors for likePost", async () => {
      const postId = "post-error";
      const error = new Error("API Error");

      (apiRequest as jest.Mock).mockRejectedValueOnce(error);

      await expect(Likes.likePost(postId)).rejects.toThrow("API Error");
    });

    it("should propagate API errors for unlikePost", async () => {
      const postId = "post-error";
      const error = new Error("Network Error");

      (apiRequest as jest.Mock).mockRejectedValueOnce(error);

      await expect(Likes.unlikePost(postId)).rejects.toThrow("Network Error");
    });
  });

  describe("integration scenarios", () => {
    it("should handle like then unlike sequence", async () => {
      const postId = "post-integration";

      (apiRequest as jest.Mock)
        .mockResolvedValueOnce(undefined) // like
        .mockResolvedValueOnce(undefined); // unlike

      await Likes.likePost(postId);
      await Likes.unlikePost(postId);

      expect(apiRequest).toHaveBeenCalledTimes(2);
      expect(apiRequest).toHaveBeenNthCalledWith(
        1,
        LIKES_ENDPOINTS.like(postId),
        { method: "POST" },
      );
      expect(apiRequest).toHaveBeenNthCalledWith(
        2,
        LIKES_ENDPOINTS.unlike(postId),
        { method: "DELETE" },
      );
    });
  });
});
