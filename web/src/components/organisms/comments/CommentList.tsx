import React from "react";
import { Comment, type CommentProps } from "../../molecules/comments/Comment";

export interface CommentListProps {
  comments: CommentProps[];
  title?: string;
  className?: string;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  title = "Komentarze",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-start w-full ${className}`}>
      <div className="px-4 pt-4 pb-2 w-full">
        <h2 className="font-jakarta font-bold text-lg leading-[23px] text-content-primary">
          {title}
        </h2>
      </div>

      <div className="w-full">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            author={comment.author}
            content={comment.content}
            timestamp={comment.timestamp}
            avatarSrc={comment.avatarSrc}
          />
        ))}
      </div>
    </div>
  );
};
