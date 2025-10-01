import { api } from "@/lib/api/client";
import { LIKES_ENDPOINTS } from "@/lib/config/api";

export const likePost = async (postId: string): Promise<void> => {
  return api.post(LIKES_ENDPOINTS.like(postId));
};

export const unlikePost = async (postId: string): Promise<void> => {
  return api.delete(LIKES_ENDPOINTS.unlike(postId));
};
