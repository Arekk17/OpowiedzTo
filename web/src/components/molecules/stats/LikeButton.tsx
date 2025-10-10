// src/components/molecules/stats/LikeButtonClient.tsx
"use client";
import React from "react";
import { HeartIcon } from "../../assets/icons/HeartIcon";
import { useLike } from "@/hooks/useLike";

type Props = { postId: string; initialLiked: boolean; initialCount: number };

export const LikeButton: React.FC<Props> = ({
  postId,
  initialLiked,
  initialCount,
}) => {
  const { liked, count, toggle, isPending } = useLike(
    postId,
    initialLiked,
    initialCount
  );

  return (
    <button
      type="button"
      className="flex flex-row justify-center items-center p-2 px-3 gap-2 disabled:opacity-60"
      aria-pressed={liked}
      aria-label={liked ? "Usuń polubienie" : "Polub"}
      onClick={toggle}
      disabled={isPending}
    >
      <div className="flex flex-col items-start w-6 h-6">
        <HeartIcon
          className={`w-6 h-6 ${
            liked ? "text-accent-error" : "text-content-secondary"
          }`}
          filled={liked}
        />
      </div>
      <span className="font-jakarta font-bold text-[13px] leading-5 text-content-secondary">
        {count}
      </span>
    </button>
  );
};
