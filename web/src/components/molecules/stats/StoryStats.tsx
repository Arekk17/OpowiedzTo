import React from "react";
import { HeartIcon } from "../../assets/icons/HeartIcon";
import { CommentIcon } from "../../assets/icons/CommentIcon";

export interface StoryStatsProps {
  likes: number;
  comments: number;
  liked?: boolean;
  onToggleLike?: (nextLiked: boolean) => void;
  className?: string;
}

export const StoryStats: React.FC<StoryStatsProps> = ({
  likes,
  comments,
  liked = false,
  onToggleLike,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row flex-wrap items-start gap-4 p-2 px-4 ${className}`}
    >
      <button
        type="button"
        className="flex flex-row justify-center items-center p-2 px-3 gap-2"
        aria-pressed={liked}
        aria-label={liked ? "Usuń polubienie" : "Polub"}
        onClick={() => onToggleLike?.(!liked)}
      >
        <div className="flex flex-col items-start w-6 h-6">
          <HeartIcon
            className={`w-6 h-6 ${
              liked ? "text-accent-error" : "text-content-secondary"
            }`}
          />
        </div>
        <span className="font-jakarta font-bold text-[13px] leading-5 text-content-secondary">
          {likes}
        </span>
      </button>

      <div className="flex flex-row justify-center items-center p-2 px-3 gap-2">
        <div className="flex flex-col items-start w-6 h-6">
          <CommentIcon className="w-6 h-6 text-content-secondary" />
        </div>
        <span className="font-jakarta font-bold text-[13px] leading-5 text-content-secondary">
          {comments}
        </span>
      </div>
    </div>
  );
};
