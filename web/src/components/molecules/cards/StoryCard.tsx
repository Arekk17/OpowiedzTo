"use client";
import React from "react";
import Image from "next/image";
import { LikeButton, LikeButtonContent } from "../../atoms/buttons/LikeButton";
import { CommentButton } from "../../atoms/buttons/CommentButton";
import { useLike } from "@/hooks/useLike";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { getPostUrl } from "@/helpers/generateSlug";

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
  tags?: string[];
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
}) => {
  const { liked, count, toggle, isPending } = useLike(id, isLiked, likesCount);
  const { isAuthenticated, isLoading } = useAuth();

  const getCategoryStyles = () => {
    switch (category) {
      case "none":
        return "";
      case "featured":
        return "border-l-story-featured bg-accent-warm/5";
      case "trending":
        return "border-l-story-trending bg-accent-error/5";
      case "new":
        return "border-l-story-new bg-accent-success/5";
      default:
        return "border-l-story-anonymous bg-primary/5";
    }
  };
  console.log(getPostUrl(id, title));

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
      ${getCategoryStyles()}
    `}
    >
      <div className="flex flex-col items-start gap-4 h-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 w-full">
          <div
            className={`flex flex-col items-start gap-1 w-full md:w-[428px] ${
              imageSrc ? "md:min-h-[160px] md:justify-between" : ""
            }`}
          >
            {category !== "none" && (
              <div className="w-full mb-2">
                <span
                  className={`
                  inline-flex items-center px-sm py-xs 
                  rounded-button text-xs font-jakarta font-medium
                  ${
                    category === "featured"
                      ? "bg-accent-warm text-content-inverse"
                      : ""
                  }
                  ${
                    category === "trending"
                      ? "bg-accent-error text-content-inverse"
                      : ""
                  }
                  ${
                    category === "new"
                      ? "bg-accent-success text-content-inverse"
                      : ""
                  }
                  ${
                    category === "anonymous"
                      ? "bg-primary text-content-inverse"
                      : ""
                  }
                `}
                >
                  {category === "featured" && "⭐ Wyróżniona"}
                  {category === "trending" && "🔥 Popularna"}
                  {category === "new" && "✨ Nowa"}
                  {category === "anonymous" && "🎭 Anonimowa"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-content-muted mb-1">
              <span className="text-xs font-jakarta">
                {isAnonymous ? "Anonim" : author}
              </span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <time className="text-xs font-jakarta">{createdAt}</time>
            </div>
            <Link
              href={getPostUrl(id, title)}
              onClick={() => {
                console.log("Link clicked!", getPostUrl(id, title));
              }}
            >
              <h3
                className="
    text-content-primary
    font-jakarta font-bold text-[16px] leading-5 
    whitespace-normal
    hover:text-primary
    transition-colors
    w-full max-w-[428px] break-words
  "
              >
                {title}
              </h3>
            </Link>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center h-6 px-2.5 rounded-full bg-ui-notification text-content-secondary font-jakarta text-[12px] leading-[18px]"
                  >
                    #{tag}
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
                <CommentButton count={12} />
              </div>
            </div>
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
