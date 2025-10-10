import React from "react";
import { ProfileAvatar } from "../../atoms/icons/ProfileAvatar";

export interface CommentAuthor {
  id: string;
  nickname: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentProps {
  author: CommentAuthor;
  content: string;
  createdAt: string;
  id: string;
  postId: string;
  updatedAt: string;
  className?: string;
  compact?: boolean;
}

export const Comment: React.FC<CommentProps> = ({
  author,
  content,
  createdAt,
  className = "",
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-row items-start ${
        compact ? "p-0" : "p-4"
      } gap-3 ${className}`}
    >
      <ProfileAvatar
        src={author.avatar ?? undefined}
        alt={author.nickname}
        size={compact ? "sm" : "md"}
      />

      <div className="flex flex-col items-start flex-1">
        <div className="flex flex-row items-start gap-3 w-full">
          <span
            className={`font-jakarta font-bold ${
              compact ? "text-xs leading-[18px]" : "text-sm leading-[21px]"
            } text-content-primary`}
          >
            {author.nickname}
          </span>
          <span
            className={`font-jakarta font-normal ${
              compact ? "text-xs leading-[18px]" : "text-sm leading-[21px]"
            } text-content-secondary`}
          >
            {createdAt}
          </span>
        </div>

        <p
          className={`font-jakarta font-normal ${
            compact
              ? "text-xs leading-[18px] line-clamp-2"
              : "text-sm leading-[21px]"
          } text-content-primary mt-0`}
        >
          {content}
        </p>
      </div>
    </div>
  );
};
