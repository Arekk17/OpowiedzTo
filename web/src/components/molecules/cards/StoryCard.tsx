import React from "react";

interface StoryCardProps {
  title: string;
  excerpt: string;
  author: string;
  timestamp: string;
  category?: "anonymous" | "featured" | "trending" | "new";
  isAnonymous?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  excerpt,
  author,
  timestamp,
  category = "anonymous",
  isAnonymous = true,
}) => {
  const getCategoryStyles = () => {
    switch (category) {
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
      rounded-card 
      p-lg 
      shadow-card 
      hover:shadow-story 
      transition-all duration-300
      border-l-4
      ${getCategoryStyles()}
    `}
    >
      <div className="flex justify-between items-start mb-sm">
        <span
          className={`
          inline-flex items-center px-sm py-xs 
          rounded-button text-xs font-jakarta font-medium
          ${
            category === "featured" ? "bg-accent-warm text-content-inverse" : ""
          }
          ${
            category === "trending"
              ? "bg-accent-error text-content-inverse"
              : ""
          }
          ${category === "new" ? "bg-accent-success text-content-inverse" : ""}
          ${category === "anonymous" ? "bg-primary text-content-inverse" : ""}
        `}
        >
          {category === "featured" && "⭐ Wyróżniona"}
          {category === "trending" && "🔥 Popularna"}
          {category === "new" && "✨ Nowa"}
          {category === "anonymous" && "🎭 Anonimowa"}
        </span>

        {isAnonymous && (
          <div className="flex items-center gap-xs text-content-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs">Anonimowa</span>
          </div>
        )}
      </div>

      <h3
        className="
        text-content-primary 
        font-jakarta font-bold text-story-title 
        mb-sm 
        line-clamp-2
        hover:text-primary
        transition-colors
        cursor-pointer
      "
      >
        {title}
      </h3>

      <p
        className="
        text-content-secondary 
        font-jakarta text-story-content 
        mb-md 
        line-clamp-3
      "
      >
        {excerpt}
      </p>

      <div className="flex justify-between items-center text-content-muted">
        <div className="flex items-center gap-xs">
          <span className="text-xs font-jakarta">
            {isAnonymous ? "Anonim" : author}
          </span>
          <span className="w-1 h-1 bg-current rounded-full"></span>
          <time className="text-xs font-jakarta">{timestamp}</time>
        </div>

        <div className="flex items-center gap-sm">
          <button
            className="
            flex items-center gap-xs 
            text-content-muted 
            hover:text-accent-warm
            transition-colors
          "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-xs">24</span>
          </button>

          <button
            className="
            flex items-center gap-xs 
            text-content-muted 
            hover:text-accent-cool
            transition-colors
          "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-xs">12</span>
          </button>
        </div>
      </div>
    </article>
  );
};
