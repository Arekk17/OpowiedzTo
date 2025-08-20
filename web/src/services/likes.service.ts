import { apiClient } from "@/lib/api/client";
import { LIKES_ENDPOINTS } from "@/lib/config/api";

export const likePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.post(LIKES_ENDPOINTS.like(postId));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd polubienia postu"
    );
  }
};

export const unlikePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.delete(LIKES_ENDPOINTS.unlike(postId));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd usunięcia polubienia"
    );
  }
};
