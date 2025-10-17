import React, { forwardRef } from "react";
import { type FieldError } from "react-hook-form";
import { clsx } from "clsx";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  error?: FieldError;
  loading?: boolean;
  containerClassName?: string;
  label?: string;
  showLabel?: boolean;
  fullWidth?: boolean;
  compact?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      loading = false,
      containerClassName,
      className,
      placeholder,
      disabled,
      label,
      showLabel = false,
      id,
      fullWidth = false,
      rows = 4,
      compact = false,
      ...props
    },
    ref,
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).slice(2, 11)}`;
    const isDisabled = disabled || loading;

    return (
      <div className={clsx("flex flex-col", containerClassName)}>
        {showLabel && label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-content-primary mb-2"
          >
            {label}
          </label>
        )}

        <div
          className={clsx(
            "transition-all duration-200",
            "bg-background-subtle border border-ui-border rounded-[12px]",
            "focus-within:ring-2 focus-within:ring-ui-focus/20 focus-within:border-ui-focus",
            isDisabled && "cursor-not-allowed opacity-60",
            fullWidth ? "w-full" : "w-[448px] min-w-[160px]",
            "flex items-center", // Dodaj flexbox dla wyśrodkowania
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            disabled={isDisabled}
            rows={rows}
            className={clsx(
              "w-full bg-transparent outline-none resize-none",
              "font-jakarta font-normal text-content-primary",
              "placeholder:text-content-secondary placeholder:font-normal",
              compact ? "px-3 py-2 text-sm leading-5" : "p-[15px] leading-6",
              className,
            )}
            placeholder={placeholder}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${textareaId}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1 text-sm text-accent-error"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
