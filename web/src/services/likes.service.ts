import { apiRequest } from "@/lib/auth";
import { LIKES_ENDPOINTS } from "@/lib/config/api";

export const likePost = async (postId: string): Promise<void> => {
  return apiRequest(LIKES_ENDPOINTS.like(postId), {
    method: "POST",
  });
};

export const unlikePost = async (postId: string): Promise<void> => {
  return apiRequest(LIKES_ENDPOINTS.unlike(postId), {
    method: "DELETE",
  });
};
