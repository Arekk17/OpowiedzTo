"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { LikeButton, LikeButtonContent } from "../../atoms/buttons/LikeButton";
import { CommentButton } from "../../atoms/buttons/CommentButton";
import { useLike } from "@/hooks/useLike";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { getPostUrl } from "@/helpers/generateSlug";
import { FormattedDate } from "../../atoms/time/FormattedDate";
import { TagType } from "@/types/tags";
import { CommentWithAuthor } from "@/types/comment";
import { CATEGORY_CONFIG } from "@/constants/getCategoryStyle";
import { StoryCardComments } from "./StoryCardComments";

export interface StoryCardProps {
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  category?: "none" | "featured" | "trending" | "new" | "anonymous";
  isAnonymous?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  id: string;
  likesCount?: number;
  isLiked?: boolean;
  tags?: TagType[];
  commentsCount?: number;
  latestComments?: CommentWithAuthor[];
}
export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  excerpt,
  author,
  createdAt,
  category = "anonymous",
  isAnonymous = true,
  imageSrc,
  imageAlt,
  id,
  likesCount = 0,
  isLiked = false,
  tags,
  commentsCount = 0,
  latestComments,
}) => {
  const config = CATEGORY_CONFIG[category];
  const { liked, count, toggle, isPending } = useLike(id, isLiked, likesCount);
  const { isAuthenticated, isLoading } = useAuth();
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const toggleComments = useCallback(() => setCommentsExpanded((v) => !v), []);

  return (
    <article
      className={`
      bg-background-paper 
      border border-ui-border 
      rounded-xl 
      p-4 
      shadow-card 
      hover:shadow-story 
      transition-all duration-300
      border-l-4
      w-full max-w-[900px]
      ${config.border}
      ${config.bg}
    `}
    >
      <div className="flex flex-col items-start gap-4 h-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 w-full">
          <div
            className={`flex flex-col items-start gap-1 w-full ${
              imageSrc ? "md:min-h-[160px] md:justify-between" : ""
            }`}
          >
            {category !== "none" && config.badge && (
              <div className="w-full mb-2">
                <span
                  className={`inline-flex items-center px-sm py-xs rounded-button text-xs font-jakarta font-medium ${config.badge?.className}`}
                >
                  {config.badge?.text}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-content-muted mb-1">
              <span className="text-xs font-jakarta">
                {isAnonymous ? "Anonim" : author}
              </span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <FormattedDate
                date={createdAt}
                className="text-xs font-jakarta"
              />
            </div>
            <Link href={getPostUrl(id, title)}>
              <h3
                className="
    text-content-primary
    font-jakarta font-bold text-[16px] leading-5 
    whitespace-normal
    hover:text-primary-accent
    transition-colors
    w-full max-w-[428px] break-words
  "
              >
                {title}
              </h3>
            </Link>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center h-6 px-2.5 rounded-full bg-ui-notification text-content-secondary font-jakarta text-[12px] leading-[18px]"
                  >
                    #{tag.name}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="inline-flex items-center h-6 px-2.5 text-content-muted font-jakarta text-[12px] leading-[18px]">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <p
              className="
              text-content-secondary
              font-jakarta text-[14px] leading-[21px]
              whitespace-normal
              w-full max-w-[628px] break-words
            "
            >
              {excerpt}
            </p>

            <div className="flex justify-start items-center w-full text-content-muted mt-2">
              <div className="flex flex-row flex-wrap items-center content-start gap-4">
                <LikeButton
                  active={liked}
                  disabled={isPending || isLoading || !isAuthenticated}
                  onClick={toggle}
                >
                  <LikeButtonContent count={count} active={liked} />
                </LikeButton>
                <CommentButton
                  count={commentsCount}
                  onClick={toggleComments}
                  className="inline-flex items-center"
                />
              </div>
            </div>
            <StoryCardComments
              isExpanded={commentsExpanded}
              comments={latestComments}
              commentsCount={commentsCount}
              postId={id}
              postTitle={title}
              postUrl={getPostUrl(id, title)}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {imageSrc && (
            <div className="relative w-full h-40 md:w-[241px] md:h-[160px] rounded-xl overflow-hidden order-2 md:order-none">
              <Image
                src={imageSrc}
                alt={imageAlt || title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 241px"
                priority={false}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
