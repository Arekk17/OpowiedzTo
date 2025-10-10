"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema, CreateCommentFormData } from "@/types/comment";
import { createComment } from "@/services/comments.service";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/atoms/inputs/Textarea";
import { Button } from "@/components/atoms/buttons/button";

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentAdded,
}) => {
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  const onSubmit = async (data: CreateCommentFormData) => {
    try {
      await createComment(postId, data);
      reset();
      onCommentAdded?.();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center text-content-secondary font-jakarta">
        Zaloguj się, aby móc komentować
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-t border-ui-border"
    >
      <div className="mb-3">
        <Textarea
          {...register("content")}
          placeholder="Napisz komentarz..."
          error={errors.content}
          fullWidth
          rows={1} // ← Zmniejsz z 3 na 2
          label="Komentarz"
          showLabel={false}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        variant="primary"
        size="sm" // ← Zmień z "md" na "sm"
      >
        {isSubmitting ? "Dodawanie..." : "Dodaj komentarz"}
      </Button>
    </form>
  );
};
