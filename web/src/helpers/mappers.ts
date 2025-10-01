import type { Post } from "@/types/post";
import type { StoryListItem } from "@/components/organisms/layout/StoriesLayout";
import { format } from "date-fns";

export const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return format(date, "dd.MM.yyyy HH:mm");
};

export const mapPostToStoryItem = (p: Post): StoryListItem => ({
  id: p.id,
  title: p.title,
  excerpt: p.content,
  author: p.author.nickname,
  createdAt: formatDateTime(p.createdAt),
  category: "none",
  isAnonymous: false,
  likesCount: p.likesCount,
  isLiked: p.isLiked,
  tags: p.tags,
});
