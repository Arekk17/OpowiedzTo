"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tag } from "../../atoms/tags/Tag";
import { FormattedDate } from "../../atoms/time/FormattedDate";
import { TagType } from "@/types/tags";
import { FlagIcon } from "@heroicons/react/24/outline";
import { ReportModal } from "../../molecules/modals/ReportModal";

export interface StoryDetailHeaderProps {
  postId?: string;
  title: string;
  content: string;
  tags: TagType[];
  publishedDate: string;
  author: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export const StoryDetailHeader: React.FC<StoryDetailHeaderProps> = ({
  postId,
  title,
  content,
  tags,
  publishedDate,
  author,
  imageSrc,
  imageAlt,
  className = "",
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div
      className={`flex flex-col items-start w-full max-w-[960px] ${className}`}
    >
      {imageSrc && (
        <div className="flex flex-col items-start p-3 px-4 w-full h-[242px]">
          <div className="w-full h-[218px] min-h-[218px] relative bg-background-subtle rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt || title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-start pt-5 px-4 pb-3 w-full">
        <h1 className="font-jakarta font-bold text-[28px] leading-[35px] text-content-primary w-full">
          {title}
        </h1>
      </div>

      <div className="flex flex-col items-start pt-1 px-4 pb-3 w-full">
        <p className="font-jakarta font-normal text-base leading-6 text-content-primary w-full">
          {content}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-row flex-wrap items-start p-3 px-3 gap-3 w-full">
          {tags.map((tag, index) => (
            <Tag key={index} label={tag.name} />
          ))}
        </div>
      )}

      <div className="flex flex-col items-start pt-1 px-4 pb-3 w-full">
        <p className="font-jakarta font-normal text-sm leading-[21px] text-content-secondary w-full">
          Opublikowano <FormattedDate date={publishedDate} className="inline" />{" "}
          przez {author}
        </p>
      </div>

      {postId && (
        <>
          <div className="flex flex-row items-center px-4 pb-3 w-full">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-content-secondary hover:text-accent-error hover:bg-background-subtle rounded-lg transition-colors"
            >
              <FlagIcon className="w-4 h-4" />
              Zgłoś historię
            </button>
          </div>

          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            targetId={postId}
            targetType="post"
          />
        </>
      )}
    </div>
  );
};
