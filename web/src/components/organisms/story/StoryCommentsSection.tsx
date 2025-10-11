"use client";

import React from "react";
import { CommentForm } from "../comments/CommentForm";
import { CommentList } from "../comments/CommentList";
import { useComments } from "@/hooks/useComments";
import type { Comment } from "@/types/comment";

interface StoryCommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

export const StoryCommentsSection: React.FC<StoryCommentsSectionProps> = ({
  postId,
  initialComments,
}) => {
  const { comments, addComment, isPending } = useComments(
    postId,
    initialComments
  );

  return (
    <>
      <CommentForm onAddComment={addComment} isPending={isPending} />
      <CommentList comments={comments} title="Komentarze" />
    </>
  );
};
