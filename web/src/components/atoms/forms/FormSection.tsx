import React from "react";
import { clsx } from "clsx";

export interface FormSectionProps {
  children: React.ReactNode;
  background?: "none" | "subtle";
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  background = "subtle",
  className = "",
}) => {
  const backgroundClasses = {
    none: "",
    subtle: "bg-ui-notification/30 rounded-xl p-4"
  };

  return (
    <div className={clsx(backgroundClasses[background], className)}>
      {children}
    </div>
  );
};
