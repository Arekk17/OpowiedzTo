interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "notification" | "profile";
}
export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "notification",
}) => {
  const baseClasses =
    "flex items-center justify-center w-10 h-10 rounded-full transition-colors";
  const variantClasses =
    variant === "notification"
      ? "bg-ui-notification text-content-primary hover:bg-ui-hover px-[10px] gap-2"
      : "bg-background-subtle text-content-primary hover:bg-ui-hover";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
