import React from "react";

interface TagProps {
  label: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, className = "" }) => {
  return (
    <span
      className={`
        inline-flex flex-row items-center justify-center
        h-8 px-4 gap-2
        bg-ui-notification text-content-primary
        rounded-full
        font-jakarta font-medium text-[14px] leading-[21px]
        whitespace-nowrap max-w-full truncate
        ${className}
      `}
    >
      {label}
    </span>
  );
};
