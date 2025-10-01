import React from "react";
import Image from "next/image";
import { Tag } from "../../atoms/tags/Tag";

export interface StoryDetailHeaderProps {
  title: string;
  content: string;
  tags: string[];
  publishedDate: string;
  author: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export const StoryDetailHeader: React.FC<StoryDetailHeaderProps> = ({
  title,
  content,
  tags,
  publishedDate,
  author,
  imageSrc,
  imageAlt,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-start w-full max-w-[960px] ${className}`}
    >
      {imageSrc && (
        <div className="flex flex-col items-start p-3 px-4 w-full h-[242px]">
          <div className="w-full h-[218px] min-h-[218px] relative bg-background-subtle rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt || title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-start pt-5 px-4 pb-3 w-full">
        <h1 className="font-jakarta font-bold text-[28px] leading-[35px] text-content-primary w-full">
          {title}
        </h1>
      </div>

      <div className="flex flex-col items-start pt-1 px-4 pb-3 w-full">
        <p className="font-jakarta font-normal text-base leading-6 text-content-primary w-full">
          {content}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-row flex-wrap items-start p-3 px-3 gap-3 w-full">
          {tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))}
        </div>
      )}

      <div className="flex flex-col items-start pt-1 px-4 pb-3 w-full">
        <p className="font-jakarta font-normal text-sm leading-[21px] text-content-secondary w-full">
          Opublikowano {publishedDate} przez {author}
        </p>
      </div>
    </div>
  );
};
