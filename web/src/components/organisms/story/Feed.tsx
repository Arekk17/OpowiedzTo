"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { getPostsCursor } from "@/services/posts.service";
import {
  StoriesLayout,
  type StoryListItem,
} from "@/components/organisms/layout/StoriesLayout";
import type { Post } from "@/types/post";
import { mapPostToStoryItem } from "@/helpers/mappers";

type InitialPage = { data: Post[]; meta: { nextCursor: string | null } };

type Props = {
  tag?: string;
  sortBy?: "newest" | "popular" | "most_commented";
  pageSize?: number;
  initialPage?: InitialPage;
};

export const Feed: React.FC<Props> = ({
  tag,
  sortBy = "newest",
  pageSize = 10,
  initialPage,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["posts", { tag, sortBy, pageSize }],
    queryFn: ({ pageParam }) =>
      getPostsCursor({
        tag,
        sortBy,
        limit: pageSize,
        cursor: (pageParam as string | undefined) ?? undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [undefined] }
      : undefined,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const items: StoryListItem[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.data.map(mapPostToStoryItem)),
    [data]
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "800px 0px 1200px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && !initialPage) return <div className="p-4">Ładowanie…</div>;
  if (status === "error") return <div className="p-4">Błąd ładowania</div>;

  return (
    <div>
      <StoriesLayout stories={items} />
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="p-4 text-content-secondary">Wczytywanie…</div>
      )}
      {!hasNextPage && (
        <div className="p-4 text-center text-content-secondary">
          To już wszystko
        </div>
      )}
    </div>
  );
};
