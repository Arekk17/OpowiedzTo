import { api } from "@/lib/api/client";
import { REPORTS_ENDPOINTS } from "@/lib/config/api";
import { CreateReportFormData } from "@/types/report";

export const reportPost = async (
  postId: string,
  data: CreateReportFormData
): Promise<void> => {
  return api.post(REPORTS_ENDPOINTS.reportPost(postId), data);
};

export const reportComment = async (
  commentId: string,
  data: CreateReportFormData
): Promise<void> => {
  return api.post(REPORTS_ENDPOINTS.reportComment(commentId), data);
};

export const getPostReportCount = async (postId: string): Promise<number> => {
  const response = await api.get<{ count: number }>(
    REPORTS_ENDPOINTS.postReportCount(postId)
  );
  return response.count;
};

export const getCommentReportCount = async (
  commentId: string
): Promise<number> => {
  const response = await api.get<{ count: number }>(
    REPORTS_ENDPOINTS.commentReportCount(commentId)
  );
  return response.count;
};
