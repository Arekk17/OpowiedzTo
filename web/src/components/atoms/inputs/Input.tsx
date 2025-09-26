import React, { forwardRef, useId } from "react";
import { type FieldError } from "react-hook-form";
import { clsx } from "clsx";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  error?: FieldError;
  loading?: boolean;
  containerClassName?: string;
  label?: string;
  showLabel?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightIconClickable?: boolean;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      size = "md",
      error,
      loading = false,
      containerClassName,
      className,
      placeholder,
      disabled,
      label,
      showLabel = false,
      helperText,
      id,
      fullWidth = false,
      leftIcon,
      rightIcon,
      rightIconClickable = false,
      onRightIconClick,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;

    const sizeStyles = (() => {
      switch (size) {
        case "sm":
          return {
            container: "h-10 rounded-lg px-3",
            input: "text-sm",
            iconBox: "w-8",
            icon: "w-4 h-4",
          };
        case "lg":
          return {
            container: "h-14 rounded-[12px] px-[15px]",
            input: "text-lg",
            iconBox: "w-12",
            icon: "w-6 h-6",
          };
        default:
          return {
            container: "h-14 rounded-[12px] px-[15px]",
            input: "text-base",
            iconBox: "w-10",
            icon: "w-5 h-5",
          };
      }
    })();

    const hasLeft = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon) || loading;

    const handleRightIconClick = () => {
      if (rightIconClickable && onRightIconClick && !loading) {
        onRightIconClick();
      }
    };

    return (
      <div className={clsx("flex flex-col", containerClassName)}>
        {showLabel && label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-content-primary mb-1"
          >
            {label}
          </label>
        )}

        <div
          className={clsx(
            "flex items-center box-border transition-all duration-200",
            "bg-white border border-ui-border",
            "focus-within:ring-2 focus-within:ring-ui-focus/20 focus-within:border-ui-focus",
            sizeStyles.container,
            disabled && "cursor-not-allowed opacity-60",
            fullWidth ? "w-full" : "w-[288px] min-w-[160px]"
          )}
        >
          {hasLeft && (
            <div
              className={clsx(
                "flex items-center justify-center mr-2",
                sizeStyles.iconBox
              )}
            >
              <div className={clsx("text-content-secondary", sizeStyles.icon)}>
                {leftIcon}
              </div>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled || loading}
            className={clsx(
              "flex-1 bg-transparent outline-none",
              "font-jakarta font-normal leading-6",
              "placeholder-content-secondary text-content-primary",
              hasLeft && "pl-0",
              hasRight && "pr-0",
              sizeStyles.input,
              className
            )}
            placeholder={placeholder}
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

          {(hasRight || loading) && (
            <div
              className={clsx(
                "flex items-center justify-center ml-2",
                sizeStyles.iconBox,
                rightIconClickable &&
                  !loading &&
                  "cursor-pointer hover:bg-gray-50 rounded transition-colors"
              )}
              onClick={handleRightIconClick}
            >
              <div className={clsx("text-content-secondary", sizeStyles.icon)}>
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  rightIcon
                )}
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

Input.displayName = "Input";
