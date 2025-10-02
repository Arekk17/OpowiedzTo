// src/components/molecules/stats/StoryStats.tsx
import React from "react";
import { CommentIcon } from "../../assets/icons/CommentIcon";
import { LikeButton } from "./LikeButton";

export interface StoryStatsProps {
  postId: string;
  likes: number;
  comments: number;
  initialLiked?: boolean;
  className?: string;
}

export const StoryStats: React.FC<StoryStatsProps> = ({
  postId,
  likes,
  comments,
  initialLiked = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row flex-wrap items-start gap-4 p-2 px-4 ${className}`}
    >
      <LikeButton
        postId={postId}
        initialLiked={initialLiked}
        initialCount={likes}
      />
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
