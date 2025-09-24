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
          />
        ))}
      </div>

      <div className="w-full flex justify-center items-center p-4">
        <div className="flex flex-row gap-0">
          <button className="flex flex-row justify-center items-center p-0 w-10 h-10 hover:bg-ui-hover rounded-lg transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.25 13.5L6.75 9L11.25 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              className={`
                flex flex-row justify-center items-center p-0 w-10 h-10 rounded-lg transition-colors
                ${
                  page === 1
                    ? "bg-ui-notification text-content-primary"
                    : "hover:bg-ui-hover text-content-secondary"
                }
              `}
            >
              <span
                className={`
                  font-jakarta text-sm leading-[21px]
                  ${page === 1 ? "font-bold" : "font-normal"}
                `}
              >
                {page}
              </span>
            </button>
          ))}

          <button className="flex flex-row justify-center items-center p-0 w-10 h-10 hover:bg-ui-hover rounded-lg transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.75 4.5L11.25 9L6.75 13.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
