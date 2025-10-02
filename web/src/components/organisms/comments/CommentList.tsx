import React from "react";
import { Comment as CommentItem } from "../../molecules/comments/Comment";
import type { Comment as CommentModel } from "@/types/comment";

export interface CommentListProps {
  comments: CommentModel[];
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
          <CommentItem
            key={comment.id}
            author={comment.author}
            content={comment.content}
            createdAt={comment.createdAt.toString()}
            updatedAt={comment.updatedAt.toString()}
            id={comment.id}
            postId={comment.postId}
            className={className}
          />
        ))}
      </div>
    </div>
  );
};
