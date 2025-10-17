import React from "react";
import { clsx } from "clsx";

export interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  error,
  helperText,
  className = "",
}) => {
  return (
    <div className={clsx("space-y-2", className)}>
      {children}
      {helperText && !error && (
        <p className="text-sm text-content-secondary">{helperText}</p>
      )}
      {error && <p className="text-sm text-accent-error">{error}</p>}
    </div>
  );
};
