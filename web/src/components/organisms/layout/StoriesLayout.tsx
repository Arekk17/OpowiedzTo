import React from "react";
import { Input } from "../../atoms/inputs/Input";
import { SearchIcon } from "../../assets/icons/SearchIcon";
import { StoryCard } from "../../molecules/cards/StoryCard";
import type { StoryCardProps } from "../../molecules/cards/StoryCard";

export type StoryListItem = { id: string | number } & StoryCardProps;

interface StoriesLayoutProps {
  className?: string;
  stories: StoryListItem[];
}

export const StoriesLayout: React.FC<StoriesLayoutProps> = ({
  className = "",
  stories,
}) => {
  return (
    <div
      className={`flex flex-col items-start w-full max-w-[725px] ${className}`}
    >
      <div className="w-full px-4 py-3">
        <Input
          placeholder="Szukaj historii..."
          fullWidth
          leftIcon={<SearchIcon className="w-5 h-5" />}
        />
      </div>

      <div className="w-full px-4 py-5 pb-3">
        <h1 className="font-jakarta font-bold text-[22px] leading-7 text-content-primary">
          Polecane historie
        </h1>
      </div>

      <div className="w-full space-y-4 px-4">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            title={story.title}
            excerpt={story.excerpt}
            author={story.author}
            timestamp={story.timestamp}
            category={story.category}
            isAnonymous={story.isAnonymous}
            imageSrc={story.imageSrc}
            imageAlt={story.imageAlt}
            id={story.id}
            likesCount={story.likesCount}
            isLiked={story.isLiked}
          />
        ))}
      </div>
    </div>
  );
};
