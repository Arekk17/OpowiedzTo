import React from "react";
import { ProfileAvatar } from "../../atoms/icons/ProfileAvatar";
import { User } from "@/types/user";

export interface CommentProps {
  author: User;
  content: string;
  createdAt: string;
  id: string;
  postId: string;
  updatedAt: string;
  className?: string;
}

export const Comment: React.FC<CommentProps> = ({
  author,
  content,
  createdAt,
  className = "",
}) => {
  return (
    <div className={`flex flex-row items-start p-4 gap-3 ${className}`}>
      <ProfileAvatar src={author.avatar} alt={author.nickname} size="md" />

      <div className="flex flex-col items-start flex-1">
        <div className="flex flex-row items-start gap-3 w-full">
          <span className="font-jakarta font-bold text-sm leading-[21px] text-content-primary">
            {author.nickname}
          </span>
          <span className="font-jakarta font-normal text-sm leading-[21px] text-content-secondary">
            {createdAt}
          </span>
        </div>

        <p className="font-jakarta font-normal text-sm leading-[21px] text-content-primary mt-0">
          {content}
        </p>
      </div>
    </div>
  );
};
