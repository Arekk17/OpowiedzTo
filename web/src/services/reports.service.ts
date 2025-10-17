import { apiRequest } from "@/lib/auth";
import { REPORTS_ENDPOINTS } from "@/lib/config/api";
import { CreateReportFormData } from "@/types/report";

export const reportPost = async (
  postId: string,
  data: CreateReportFormData,
): Promise<void> => {
  return apiRequest(REPORTS_ENDPOINTS.reportPost(postId), {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const reportComment = async (
  commentId: string,
  data: CreateReportFormData,
): Promise<void> => {
  return apiRequest(REPORTS_ENDPOINTS.reportComment(commentId), {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getPostReportCount = async (postId: string): Promise<number> => {
  const response = await apiRequest<{ count: number }>(
    REPORTS_ENDPOINTS.postReportCount(postId),
    {
      method: "GET",
    },
  );
  return response.count;
};

export const getCommentReportCount = async (
  commentId: string,
): Promise<number> => {
  const response = await apiRequest<{ count: number }>(
    REPORTS_ENDPOINTS.commentReportCount(commentId),
    {
      method: "GET",
    },
  );
  return response.count;
};
