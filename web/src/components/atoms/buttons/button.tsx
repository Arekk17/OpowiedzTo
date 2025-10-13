import React from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const sizeClasses =
    size === "sm"
      ? "h-10 px-4 text-sm rounded-lg"
      : size === "lg"
      ? "h-14 px-6 text-base rounded-xl"
      : "h-12 px-5 text-base rounded-xl";

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-background-paper hover:opacity-95"
      : variant === "secondary"
      ? "bg-ui-notification text-content-primary hover:bg-ui-hover"
      : variant === "danger"
      ? "bg-accent-error text-background-paper hover:opacity-95"
      : variant === "success"
      ? "bg-accent-success text-background-paper hover:opacity-95"
      : "bg-primary border border-ui-border text-content-primary hover:bg-ui-hover";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center transition-colors",
        sizeClasses,
        variantClasses,
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
    >
      {loading && (
        <span className="mr-2 inline-flex">
          <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};
