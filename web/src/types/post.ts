import { z } from "zod";

export interface PostWithComments {
  comments: Comment[];
}

export interface UpdatePostForm {
  title?: string;
  content?: string;
  tags?: string[];
}

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      postCount: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
  authorId: z.string(),
  author: z.object({
    id: z.string(),
    email: z.string(),
    nickname: z.string(),
    gender: z.string().optional(),
    avatar: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  commentsCount: z.number(),
  latestComments: z
    .array(
      z.object({
        id: z.string(),
        authorId: z.string().optional(),
        content: z.string(),
        createdAt: z.string(),
        author: z.object({
          id: z.string(),
          email: z.string(),
          nickname: z.string(),
          gender: z.string().optional(),
          createdAt: z.string(),
          updatedAt: z.string(),
          avatar: z.string().nullable().optional(),
        }),
      })
    )
    .default([]),
  likesCount: z.number(),
  isLiked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createPostSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  content: z.string().min(1, "Treść jest wymagana"),
  tags: z.array(z.string()).min(1, "Przynajmniej jeden tag jest wymagany"),
});

export const updatePostSchema = createPostSchema.partial();

export const postFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  authorId: z.string().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["newest", "popular", "most_commented"]).optional(),
});

export const searchPostsSchema = z.object({
  q: z.string().min(1, "Termin wyszukiwania jest wymagany"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const trendingTagsSchema = z.object({
  tag: z.string(),
  count: z.number(),
});

export type Post = z.infer<typeof postSchema>;
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type PostFiltersData = z.infer<typeof postFiltersSchema>;
export type SearchPostsData = z.infer<typeof searchPostsSchema>;
export type TrendingTags = z.infer<typeof trendingTagsSchema>;
