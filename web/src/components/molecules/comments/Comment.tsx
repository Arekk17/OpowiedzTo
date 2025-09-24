import React from "react";
import { ProfileAvatar } from "../../atoms/icons/ProfileAvatar";

export interface CommentProps {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarSrc?: string;
  className?: string;
}

export const Comment: React.FC<CommentProps> = ({
  author,
  content,
  timestamp,
  avatarSrc,
  className = "",
}) => {
  return (
    <div className={`flex flex-row items-start p-4 gap-3 ${className}`}>
      <ProfileAvatar src={avatarSrc} alt={author} size="md" />

      <div className="flex flex-col items-start flex-1">
        <div className="flex flex-row items-start gap-3 w-full">
          <span className="font-jakarta font-bold text-sm leading-[21px] text-content-primary">
            {author}
          </span>
          <span className="font-jakarta font-normal text-sm leading-[21px] text-content-secondary">
            {timestamp}
          </span>
        </div>

        <p className="font-jakarta font-normal text-sm leading-[21px] text-content-primary mt-0">
          {content}
        </p>
      </div>
    </div>
  );
};
