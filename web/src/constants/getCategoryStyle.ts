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
