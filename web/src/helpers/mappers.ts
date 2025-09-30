import type { Post } from "@/types/post";
import type { StoryListItem } from "@/components/organisms/layout/StoriesLayout";

export const mapPostToStoryItem = (p: Post): StoryListItem => ({
  id: p.id,
  title: p.title,
  excerpt: p.content,
  author: p.author.nickname,
  timestamp: p.createdAt,
  category: "none",
  isAnonymous: false,
  likesCount: p.likesCount,
  isLiked: p.isLiked,
});
