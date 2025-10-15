import type { Post } from "@/types/post";
import type { StoryListItem } from "@/types/story";

export const mapPostToStoryItem = (p: Post): StoryListItem => ({
  id: p.id,
  title: p.title,
  excerpt: p.content,
  author: p.author.nickname,
  authorId: p.authorId,
  createdAt: p.createdAt,
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
