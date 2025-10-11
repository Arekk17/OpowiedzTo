import type { Post } from "@/types/post";
import type { StoryListItem } from "@/components/organisms/layout/StoriesLayout";

// Re-export dla wygody
export { formatDateTime, formatRelativeTime } from "./formatDate";

/**
 * Mapuje Post z API na StoryListItem dla UI
 *
 * ⚠️ NIE formatuje dat - przekazuje raw ISO strings
 * Komponenty UI używają <FormattedDate> i <RelativeTime> do formatowania
 */
export const mapPostToStoryItem = (p: Post): StoryListItem => ({
  id: p.id,
  title: p.title,
  excerpt: p.content,
  author: p.author.nickname,
  createdAt: p.createdAt, // ✅ Raw ISO string
  category: "none",
  isAnonymous: false,
  likesCount: p.likesCount,
  isLiked: p.isLiked,
  tags: p.tags,
  commentsCount: p.commentsCount ?? 0,
  latestComments: (p.latestComments ?? []).map((comment) => ({
    ...comment,
    author: {
      ...comment.author,
      avatar: comment.author.avatar ?? null,
    },
  })),
});
