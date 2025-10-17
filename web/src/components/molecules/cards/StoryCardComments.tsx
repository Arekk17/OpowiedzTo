"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { CommentItem } from "../comments/CommentItem";
import { useComments } from "@/hooks/useComments";
import { CommentForm } from "@/components/organisms/comments/CommentForm";
const MAX_VISIBLE_COMMENTS = 3;
const COMMENTS_EXPANDED_HEIGHT = 680;

interface StoryCardCommentsProps {
  isExpanded: boolean;
  commentsCount: number;
  postId: string;
  postTitle: string;
  postUrl: string;
  isAuthenticated: boolean;
}

export const StoryCardComments: React.FC<StoryCardCommentsProps> = ({
  isExpanded,
  commentsCount,
  postId,
  postUrl,
  isAuthenticated,
}) => {
  const { comments, addComment, refetch, isPending } = useComments(
    postId,
    [],
    3,
    {
      enabled: isExpanded,
    },
  );

  useEffect(() => {
    if (isExpanded) {
      refetch();
    }
  }, [isExpanded, refetch]);
  return (
    <div
      className={`w-full mt-3 border-t border-ui-border overflow-hidden transition-all duration-300 ease-out ${
        isExpanded
          ? `pt-3 max-h-[${COMMENTS_EXPANDED_HEIGHT}px] opacity-100`
          : "pt-0 max-h-0 opacity-0"
      }`}
      aria-hidden={!isExpanded}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-jakarta text-content-muted">
          Ostatnie komentarze
        </span>
        <Link
          href={`${postUrl}#comments`}
          className="text-xs font-jakarta text-primary hover:text-primary-dark"
        >
          Zobacz wszystkie ({commentsCount})
        </Link>
      </div>

      {/* Comments List */}
      <div className="mt-2 space-y-2">
        {comments && comments.length > 0 ? (
          comments.slice(0, MAX_VISIBLE_COMMENTS).map((c, idx) => (
            <div
              key={c.id}
              className="transition-all duration-300 ease-out"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <CommentItem
                id={c.id}
                postId={postId}
                content={c.content}
                createdAt={c.createdAt}
                updatedAt={c.createdAt}
                author={{
                  id: c.author.id,
                  nickname: c.author.nickname,
                  createdAt: c.author.createdAt,
                  updatedAt: c.author.updatedAt,
                  avatar: c.author.avatar,
                }}
                compact
                className="border-b border-ui-border last:border-0 pb-2"
              />
            </div>
          ))
        ) : (
          <p className="text-xs text-content-muted font-jakarta">
            Bądź pierwszą osobą, która skomentuje.
          </p>
        )}
      </div>

      {/* Comment Input */}
      <div className="mt-2">
        {isAuthenticated ? (
          <CommentForm onAddComment={addComment} isPending={isPending} />
        ) : (
          <Link
            href="/auth/login"
            className="text-xs text-content-muted hover:text-content-primary"
          >
            Zaloguj się, aby skomentować
          </Link>
        )}
      </div>
    </div>
  );
};
