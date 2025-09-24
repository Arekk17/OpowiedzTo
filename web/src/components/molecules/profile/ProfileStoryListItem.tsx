import React from "react";
import Image from "next/image";

export interface ProfileStoryListItemProps {
  tagsText?: string; // np. "Tagi: #zycie #przemyslenia"
  title: string;
  excerpt?: string;
  imageSrc?: string;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
}

export const ProfileStoryListItem: React.FC<ProfileStoryListItemProps> = ({
  tagsText,
  title,
  excerpt,
  imageSrc,
  imageAlt,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row justify-between items-start p-4 gap-4 w-full ${className}`}
    >
      <div className="flex flex-col items-start gap-1 w-[608px] max-w-[608px]">
        {tagsText && (
          <div className="font-jakarta font-normal text-sm leading-[21px] text-content-secondary">
            {tagsText}
          </div>
        )}
        <button
          type="button"
          onClick={onClick}
          className="text-left font-jakarta font-bold text-[16px] leading-5 text-content-primary hover:text-accent-primary transition-colors"
        >
          {title}
        </button>
        {excerpt && (
          <div className="font-jakarta font-normal text-sm leading-[21px] text-content-secondary">
            {excerpt}
          </div>
        )}
      </div>

      {imageSrc && (
        <div className="relative w-[320px] h-[171px] rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
};
