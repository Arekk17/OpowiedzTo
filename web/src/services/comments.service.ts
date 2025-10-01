import { api } from "@/lib/api/client";
import { COMMENTS_ENDPOINTS } from "@/lib/config/api";
import { Comment, CreateCommentFormData } from "@/types/comment";

export const getComments = async (postId: string): Promise<Comment[]> => {
  return api.get<Comment[]>(COMMENTS_ENDPOINTS.list(postId));
};

export const createComment = async (
  postId: string,
  data: CreateCommentFormData
): Promise<Comment> => {
  return api.post<Comment>(COMMENTS_ENDPOINTS.create(postId), data);
};

export const deleteComment = async (id: string): Promise<void> => {
  return api.delete(COMMENTS_ENDPOINTS.delete(id));
};
