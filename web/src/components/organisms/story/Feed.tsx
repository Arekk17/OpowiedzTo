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
    retry: (failureCount, error) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 2;
    },
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

  if (isLoading && !initialPage) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Ładowanie postów...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Błąd ładowania</h3>
        <p className="text-muted-foreground mb-4">
          Nie udało się załadować postów. Spróbuj ponownie.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Odśwież stronę
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-4 text-center">
        <div className="text-muted-foreground mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Brak postów</h3>
        <p className="text-muted-foreground">
          {tag
            ? `Nie znaleziono postów z tagiem "${tag}"`
            : "Nie ma jeszcze żadnych postów"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <StoriesLayout stories={items} />
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="p-4 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          Wczytywanie kolejnych postów...
        </div>
      )}
      {!hasNextPage && items.length > 0 && (
        <div className="p-4 text-center text-muted-foreground">
          To już wszystko
        </div>
      )}
    </div>
  );
};
