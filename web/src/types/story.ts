import type { StoryCardProps } from "@/components/molecules/cards/StoryCard";

export interface StoryListItem extends StoryCardProps {
  id: string;
  authorId: string;
}
