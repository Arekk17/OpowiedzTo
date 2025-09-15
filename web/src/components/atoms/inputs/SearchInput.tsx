import React, { forwardRef } from "react";
import { SearchIcon } from "../../assets/icons/SearchIcon";
import { type FieldError } from "react-hook-form";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "outlined" | "filled" | "minimal";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: FieldError;
  loading?: boolean;
  containerClassName?: string;
  iconClassName?: string;
  label?: string;
  showLabel?: boolean;
  helperText?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      error,
      loading = false,
      containerClassName,
      iconClassName,
      className,
      placeholder = "Szukaj...",
      disabled,
      label,
      showLabel = false,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || `search-input-${Math.random().toString(36).substr(2, 9)}`;

    const defaultSearchIcon = (
      <SearchIcon className={cn("w-6 h-6", iconClassName)} />
    );

    const loadingSpinner = (
      <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
    );

    const getVariantStyles = () => {
      const baseStyles = "transition-all duration-200 focus-within:ring-2";

      switch (variant) {
        case "outlined":
          return cn(
            baseStyles,
            "border-2",
            "bg-background-paper",
            error
              ? "border-accent-error focus-within:ring-accent-error/20"
              : "border-ui-border focus-within:border-ui-focus focus-within:ring-ui-focus/20",
            disabled && "border-content-muted bg-background-subtle"
          );
        case "filled":
          return cn(
            baseStyles,
            "border-0",
            error
              ? "bg-accent-error/10 focus-within:ring-accent-error/20"
              : "bg-background-subtle focus-within:ring-ui-focus/20",
            disabled && "bg-background-muted"
          );
        case "minimal":
          return cn(
            baseStyles,
            "border-0 border-b-2 rounded-none bg-transparent",
            error
              ? "border-accent-error focus-within:ring-accent-error/20"
              : "border-ui-border focus-within:border-ui-focus focus-within:ring-ui-focus/20",
            disabled && "border-content-muted"
          );
        default:
          return cn(
            baseStyles,
            "border-0",
            "bg-ui-notification",
            error
              ? "bg-accent-error/10 focus-within:ring-accent-error/20"
              : "focus-within:ring-ui-focus/20",
            disabled && "bg-background-muted"
          );
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return {
            container: "h-10 rounded-lg",
            iconContainer: "w-8 px-2",
            input: "px-2 text-sm",
            icon: "w-4 h-4",
          };
        case "lg":
          return {
            container: "h-14 rounded-xl",
            iconContainer: "w-12 px-4",
            input: "px-4 text-lg",
            icon: "w-7 h-7",
          };
        default:
          return {
            container: "h-12 rounded-xl",
            iconContainer: "w-10 px-4",
            input: "px-2 text-base",
            icon: "w-6 h-6",
          };
      }
    };

    const sizeStyles = getSizeStyles();
    const displayLeftIcon = leftIcon || defaultSearchIcon;
    const displayRightIcon = loading ? loadingSpinner : rightIcon;

    return (
      <div className={cn("flex flex-col", containerClassName)}>
        {showLabel && label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-content-primary mb-1"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex items-center overflow-hidden",
            getVariantStyles(),
            sizeStyles.container,
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {displayLeftIcon && (
            <div
              className={cn(
                "flex items-center justify-center flex-shrink-0",
                sizeStyles.iconContainer,
                variant === "default" ? "bg-ui-notification" : "",
                variant === "default" && "rounded-l-xl"
              )}
            >
              <div
                className={cn(
                  "text-content-secondary flex items-center justify-center",
                  sizeStyles.icon
                )}
              >
                {displayLeftIcon}
              </div>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex-1 bg-transparent outline-none",
              "placeholder-content-secondary text-content-primary",
              "font-normal leading-6",
              sizeStyles.input,
              disabled && "cursor-not-allowed text-content-muted",
              className
            )}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {displayRightIcon && (
            <div
              className={cn(
                "flex items-center justify-center flex-shrink-0",
                sizeStyles.iconContainer,
                loading && "text-content-secondary"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center text-content-secondary",
                  sizeStyles.icon
                )}
              >
                {displayRightIcon}
              </div>
            </div>
          )}
        </div>

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-content-secondary"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-accent-error">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
