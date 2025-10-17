import React from "react";
import { clsx } from "clsx";

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  size?: "sm" | "md" | "lg";
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <label
      {...props}
      className={clsx(
        "font-jakarta font-medium text-content-primary block",
        sizeClasses[size],
        className,
      )}
    >
      {children}
      {required && <span className="text-accent-error ml-1">*</span>}
    </label>
  );
};
