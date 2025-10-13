import { apiRequest } from "@/lib/auth";
import { COMMENTS_ENDPOINTS } from "@/lib/config/api";
import { Comment, CreateCommentFormData } from "@/types/comment";

type ApiOptions = { cookieHeader?: string };

export const getComments = async (
  postId: string,
  options?: ApiOptions & { limit?: number }
): Promise<Comment[]> => {
  const qs = options?.limit ? `?limit=${options.limit}` : "";
  // ważne: zwracamy ŚCIEŻKĘ względną, nie pełny URL
  return apiRequest<Comment[]>(`${COMMENTS_ENDPOINTS.list(postId)}${qs}`, {
    method: "GET",
    ...options,
  });
};

export const createComment = async (
  postId: string,
  data: CreateCommentFormData
): Promise<Comment> => {
  return apiRequest<Comment>(COMMENTS_ENDPOINTS.create(postId), {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteComment = async (id: string): Promise<void> => {
  return apiRequest(COMMENTS_ENDPOINTS.delete(id), { method: "DELETE" });
};
