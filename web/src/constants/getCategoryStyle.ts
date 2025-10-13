export const getCategoryStyles = (category: string) => {
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
export const CATEGORY_CONFIG = {
  none: { border: "", bg: "", badge: null },
  featured: {
    border: "border-l-story-featured",
    bg: "bg-accent-warm/5",
    badge: {
      text: "⭐ Wyróżniona",
      className: "bg-accent-warm text-content-inverse",
    },
  },
  trending: {
    border: "border-l-story-trending",
    bg: "bg-accent-error/5",
    badge: {
      text: "🔥 Popularna",
      className: "bg-accent-error text-content-inverse",
    },
  },
  new: {
    border: "border-l-story-new",
    bg: "bg-accent-success/5",
    badge: {
      text: "✨ Nowa",
      className: "bg-accent-success text-content-inverse",
    },
  },
  anonymous: {
    border: "border-l-story-anonymous",
    bg: "bg-primary/5",
    badge: {
      text: "🎭 Anonimowa",
      className: "bg-primary text-content-inverse",
    },
  },
} as const;
