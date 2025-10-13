interface IconButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  variant?:
    | "notification"
    | "profile"
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  tooltip?: string;
}
export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "notification",
  size = "md",
  disabled = false,
  tooltip,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const variantClasses = {
    notification:
      "bg-ui-notification text-content-primary hover:bg-ui-hover px-[10px] gap-2 rounded-full",
    profile:
      "bg-background-subtle text-content-primary hover:bg-ui-hover rounded-full",
    primary:
      "bg-accent-primary text-background-paper hover:bg-accent-primary/90 rounded-lg",
    secondary:
      "bg-ui-notification text-content-primary hover:bg-ui-hover rounded-lg",
    danger:
      "bg-accent-error text-background-paper hover:bg-accent-error/90 rounded-lg",
    success:
      "bg-accent-success text-background-paper hover:bg-accent-success/90 rounded-lg",
    ghost: "bg-transparent text-content-primary hover:bg-ui-hover rounded-lg",
  };

  const baseClasses =
    "flex items-center justify-center transition-all duration-200";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${
        variantClasses[variant]
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
    >
      {children}
    </button>
  );
};
