import { apiClient } from "@/lib/api/client";
import { REPORTS_ENDPOINTS } from "@/lib/config/api";
import { CreateReportFormData } from "@/types/report";

export const reportPost = async (
  postId: string,
  data: CreateReportFormData
): Promise<void> => {
  try {
    await apiClient.post(REPORTS_ENDPOINTS.reportPost(postId), data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd raportowania postu"
    );
  }
};
export const reportComment = async (
  commentId: string,
  data: CreateReportFormData
): Promise<void> => {
  try {
    await apiClient.post(REPORTS_ENDPOINTS.reportComment(commentId), data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd raportowania komentarza"
    );
  }
};
export const getPostReportCount = async (postId: string): Promise<number> => {
  try {
    const response = await apiClient.get<{ count: number }>(
      REPORTS_ENDPOINTS.postReportCount(postId)
    );
    return response.count;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Błąd pobierania liczby zgłoszeń postu"
    );
  }
};

export const getCommentReportCount = async (
  commentId: string
): Promise<number> => {
  try {
    const response = await apiClient.get<{ count: number }>(
      REPORTS_ENDPOINTS.commentReportCount(commentId)
    );
    return response.count;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Błąd pobierania liczby zgłoszeń komentarza"
    );
  }
};
