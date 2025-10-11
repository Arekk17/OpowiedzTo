import { Comment as CommentItem } from "../../molecules/comments/Comment";
import type { Comment } from "@/types/comment";

export interface CommentListProps {
  comments: Comment[];
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
            author={{
              ...comment.author,
              createdAt: comment.author.createdAt,
              updatedAt: comment.author.updatedAt,
            }}
            content={comment.content}
            createdAt={comment.createdAt}
            updatedAt={comment.updatedAt}
            id={comment.id}
            postId={comment.postId}
            className={className}
          />
        ))}
      </div>
    </div>
  );
};
