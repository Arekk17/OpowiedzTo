// web/src/hooks/useComments.ts
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "@/services/comments.service";
import type { Comment, CreateCommentFormData } from "@/types/comment";
import { useAuth } from "./useAuth";
import { Gender } from "@/types/auth";

export const useComments = (
  postId: string,
  initialComments: Comment[] = []
) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const queryKey = ["comments", postId];

  const { data: comments = initialComments } = useQuery({
    queryKey,
    queryFn: () => getComments(postId),
    initialData: initialComments,
    staleTime: 30_000,
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (data: CreateCommentFormData) => createComment(postId, data),

    onMutate: async (newCommentData) => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<Comment[]>(queryKey);

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        postId,
        authorId: user?.id || "",
        content: newCommentData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: user?.id || "",
          email: user?.email || "",
          nickname: user?.nickname || "Ty",
          gender: Gender.OTHER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      queryClient.setQueryData<Comment[]>(queryKey, (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { previousComments };
    },

    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(queryKey, (old = []) => {
        const withoutTemp = old.filter((c) => !c.id.startsWith("temp-"));
        return [newComment, ...withoutTemp];
      });
    },

    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    comments,
    addComment,
    isPending,
  };
};
