import { z } from "zod";
import { User, BaseEntity } from "./user";

export enum ReportCategory {
  SPAM = "SPAM",
  OFFENSIVE = "OFFENSIVE",
  FALSE_INFO = "FALSE_INFO",
  INAPPROPRIATE = "INAPPROPRIATE",
  OTHER = "OTHER",
}

export interface PostReport extends BaseEntity {
  postId: string;
  reporterId: string;
  category: ReportCategory;
  reason?: string;
  reporter: User;
}

export interface CommentReport extends BaseEntity {
  commentId: string;
  reporterId: string;
  category: ReportCategory;
  reason?: string;
  reporter: User;
}

export interface CreateReportForm {
  category: ReportCategory;
  reason?: string;
}

export const createReportSchema = z.object({
  category: z.enum(
    [
      ReportCategory.SPAM,
      ReportCategory.OFFENSIVE,
      ReportCategory.FALSE_INFO,
      ReportCategory.INAPPROPRIATE,
      ReportCategory.OTHER,
    ],
    {
      message: "Wybierz kategorię zgłoszenia",
    },
  ),
  reason: z
    .string()
    .trim()
    .max(500, "Powód nie może być dłuższy niż 500 znaków")
    .optional(),
});

export type CreateReportFormData = z.infer<typeof createReportSchema>;
