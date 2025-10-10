import { z } from "zod";
import { User, BaseEntity } from "./user";

export interface Comment extends BaseEntity {
  postId: string;
  authorId: string;
  author: User;
  content: string;
}
export interface CommentWithAuthor {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    nickname: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateCommentForm {
  content: string;
}

export interface UpdateCommentForm {
  content: string;
}

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Komentarz nie może być pusty")
    .max(1000, "Komentarz nie może być dłuższy niż 1000 znaków"),
});

export const updateCommentSchema = createCommentSchema;

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
