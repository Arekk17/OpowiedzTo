import { apiClient } from "@/lib/api/client";
import { COMMENTS_ENDPOINTS } from "@/lib/config/api";
import { Comment, CreateCommentFormData } from "@/types/comment";

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    return await apiClient.get<Comment[]>(COMMENTS_ENDPOINTS.list(postId));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania komentarzy"
    );
  }
};

export const createComment = async (
  postId: string,
  data: CreateCommentFormData
): Promise<Comment> => {
  try {
    return await apiClient.post<Comment>(
      COMMENTS_ENDPOINTS.create(postId),
      data
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd tworzenia komentarza"
    );
  }
};

export const deleteComment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(COMMENTS_ENDPOINTS.delete(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd usuwania komentarza"
    );
  }
};
