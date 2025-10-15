// web/src/components/organisms/comments/CommentForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema, CreateCommentFormData } from "@/types/comment";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/atoms/buttons/button";
import { Textarea } from "@/components/atoms/inputs/Textarea";

interface CommentFormProps {
  onAddComment: (data: CreateCommentFormData) => void;
  isPending?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onAddComment,
  isPending = false,
}) => {
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  const onSubmit = async (data: CreateCommentFormData) => {
    onAddComment(data);
    reset();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center text-content-secondary font-jakarta text-sm">
        Zaloguj się, aby móc komentować
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-t border-ui-border"
    >
      <div className="max-w-2xl">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Textarea
              {...register("content")}
              placeholder="Napisz komentarz..."
              disabled={isPending}
              rows={1}
              compact
              fullWidth
              error={errors.content}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            loading={isPending}
            variant="success"
            size="sm"
            className="shrink-0 h-10 w-10 p-0 rounded-full flex items-center justify-center"
          >
            <span className="text-lg leading-none">➤</span>
          </Button>
        </div>
      </div>
    </form>
  );
};
