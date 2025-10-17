"use client";
import { likePost, unlikePost } from "@/services/likes.service";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { ApiError } from "@/types/errors";

export const useLike = (
  postId: string,
  initialLiked: boolean,
  initialCount: number,
) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [postId, initialLiked, initialCount]);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ nextLiked }: { nextLiked: boolean }) => {
      if (nextLiked) {
        return likePost(postId);
      }
      return unlikePost(postId);
    },
    onMutate: ({ nextLiked }) => {
      const prevLiked = liked;
      const prevCount = count;

      setLiked(nextLiked);
      setCount((prev) => (nextLiked ? prev + 1 : prev - 1));

      return { prevLiked, prevCount };
    },
    onError: (error, _variables, ctx) => {
      const apiError = error as ApiError;
      const status = apiError?.statusCode;
      const message = apiError?.message || "";

      if (status === 400 && message.includes("polubiłeś")) {
        setLiked(true);
        setCount((prev) => Math.max(prev, 1));
        return;
      }

      if (status === 404 && message.includes("Nie polubiłeś")) {
        setLiked(false);
        setCount((prev) => Math.max(prev, 0));
        return;
      }

      if (ctx) {
        setLiked(ctx.prevLiked);
        setCount(ctx.prevCount);
      }
    },
  });

  const toggle = useCallback(() => {
    mutate({ nextLiked: !liked });
  }, [liked, mutate]);

  return {
    liked,
    count,
    toggle,
    isPending,
  };
};
