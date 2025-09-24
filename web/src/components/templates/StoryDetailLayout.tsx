import React from "react";
import {
  StoryDetailHeader,
  type StoryDetailHeaderProps,
} from "../organisms/story/StoryDetailHeader";
import {
  StoryStats,
  type StoryStatsProps,
} from "../molecules/stats/StoryStats";
import {
  CommentList,
  type CommentListProps,
} from "../organisms/comments/CommentList";
import {
  ActionButtons,
  type ActionButtonsProps,
} from "../molecules/actions/ActionButtons";

export interface StoryDetailLayoutProps {
  story: StoryDetailHeaderProps;
  stats: StoryStatsProps;
  comments: CommentListProps;
  actions: ActionButtonsProps;
  className?: string;
}

export const StoryDetailLayout: React.FC<StoryDetailLayoutProps> = ({
  story,
  stats,
  comments,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row justify-center items-start py-5 px-40 w-full min-h-screen ${className}`}
    >
      <div className="flex flex-col items-start w-full max-w-[960px]">
        {/* Story Header */}
        <StoryDetailHeader {...story} />

        {/* Stats */}
        <StoryStats {...stats} />

        {/* Comments */}
        <CommentList {...comments} />

        {/* Action Buttons */}
        <ActionButtons {...actions} />
      </div>
    </div>
  );
};
