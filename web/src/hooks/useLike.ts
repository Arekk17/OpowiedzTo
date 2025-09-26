"use client";
import { likePost, unlikePost } from "@/services/likes.service";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useLike = (
  postId: string,
  initialLiked: boolean,
  initialCount: number
) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    console.log(
      `useLike ${postId}: syncing state - initialLiked=${initialLiked}, initialCount=${initialCount}`
    );
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
      console.log(
        `useLike ${postId}: optimistic update - nextLiked=${nextLiked}, currentLiked=${liked}, currentCount=${count}`
      );
      setLiked(nextLiked);
      setCount((prev) => (nextLiked ? prev + 1 : prev - 1));
      return {
        prevLiked: !nextLiked,
        prevCount: nextLiked ? count - 1 : count + 1,
      };
    },
    onSuccess: (data, variables) => {
      console.log(
        `useLike ${postId}: success - nextLiked=${variables.nextLiked}`
      );
    },
    onError: (error, variables, ctx) => {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message || "";

      console.log(
        `Like error: status=${status}, message="${message}", nextLiked=${variables.nextLiked}`
      );

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

  return {
    liked,
    count,
    toggle: () => mutate({ nextLiked: !liked }),
    isPending,
  };
};
