"use client";
import { likePost, unlikePost } from "@/services/likes.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useLike = (
  postId: string,
  initialLiked: boolean,
  initialCount: number
) => {
  const qc = useQueryClient();
  const key = ["post-likes", postId];

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => (liked ? unlikePost(postId) : likePost(postId)),
    onMutate: async () => {
      setLiked((prev) => !prev);
      setCount((count) => (liked ? count - 1 : count + 1));
    },
    onError: () => {
      setLiked(initialLiked);
      setCount(initialCount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });
  return { liked, count, toggle: () => mutate(), isPending };
};
