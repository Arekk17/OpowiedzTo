"use client";

import React, { useState } from "react";
import { ProfileAvatar } from "../../atoms/icons/ProfileAvatar";
import { RelativeTime } from "../../atoms/time/RelativeTime";
import { FlagIcon } from "@heroicons/react/24/outline";
import { ReportModal } from "../modals/ReportModal";

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

export const CommentItem: React.FC<CommentProps> = ({
  author,
  content,
  createdAt,
  id,
  className = "",
  compact = false,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
        <div className="flex flex-row items-center justify-between gap-3 w-full">
          <div className="flex flex-row items-center gap-3">
            <span
              className={`font-jakarta font-bold ${
                compact ? "text-xs leading-[18px]" : "text-sm leading-[21px]"
              } text-content-primary`}
            >
              {author.nickname}
            </span>
            <RelativeTime
              date={createdAt}
              className={`font-jakarta font-normal ${
                compact ? "text-xs leading-[18px]" : "text-sm leading-[21px]"
              } text-content-secondary`}
            />
          </div>
          {!compact && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-1 text-content-secondary hover:text-accent-error transition-colors"
              title="Zgłoś komentarz"
            >
              <FlagIcon className="w-4 h-4" />
            </button>
          )}
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetId={id}
        targetType="comment"
      />
    </div>
  );
};
