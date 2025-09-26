"use client";
import React from "react";
import Image from "next/image";
import { LikeButton, LikeButtonContent } from "../../atoms/buttons/LikeButton";
import { CommentButton } from "../../atoms/buttons/CommentButton";
import { useLike } from "@/hooks/useLike";
import { useAuth } from "@/hooks/useAuth";

export interface StoryCardProps {
  title: string;
  excerpt: string;
  author: string;
  timestamp: string;
  category?: "anonymous" | "featured" | "trending" | "new" | "none";
  isAnonymous?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  id: string;
}
export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  excerpt,
  author,
  timestamp,
  category = "anonymous",
  isAnonymous = true,
  imageSrc,
  imageAlt,
  id,
}) => {
  const { liked, count, toggle, isPending } = useLike(id, false, 0);
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
      w-full max-w-[725px]
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
              <time className="text-xs font-jakarta">{timestamp}</time>
            </div>

            <h3
              className="
              text-content-primary
              font-jakarta font-bold text-[16px] leading-5 
              whitespace-normal
              hover:text-primary
              transition-colors
              cursor-pointer
              w-full max-w-[428px] break-words
            "
            >
              {title}
            </h3>

            <p
              className="
              text-content-secondary
              font-jakarta text-[14px] leading-[21px]
              whitespace-normal
              w-full max-w-[428px] break-words
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
