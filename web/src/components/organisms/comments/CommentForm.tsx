// web/src/components/organisms/comments/CommentForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema, CreateCommentFormData } from "@/types/comment";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/atoms/inputs/Textarea";
import { Button } from "@/components/atoms/buttons/button";

interface CommentFormProps {
  onAddComment: (data: CreateCommentFormData) => void; // ✅ Zmiana
  isPending?: boolean; // ✅ Nowe
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
    reset(); // ✅ Reset od razu (optimistic)
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
          rows={3}
          label="Komentarz"
          showLabel={false}
          disabled={isPending} // ✅ Disable podczas submitu
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        loading={isPending}
        variant="primary"
        size="sm"
      >
        {isPending ? "Dodawanie..." : "Dodaj komentarz"}
      </Button>
    </form>
  );
};
