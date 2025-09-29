import React from "react";
import { FilterLayout } from "@/components/molecules/layout/FilterLayout";
import {
  StoriesLayout,
  type StoryListItem,
} from "@/components/organisms/layout/StoriesLayout";
import { TrendingSidebar } from "@/components/organisms/layout/TrendingSidebar";
import { SortOptions } from "@/components/molecules/forms/SortOptions";
import { getPostsWithCookie, getTrendingTags } from "@/services/posts.service";
import Link from "next/link";
import { Pagination } from "@/components/molecules/navigation/Pagination";
import { cookies } from "next/headers";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tags: string[] = ["Miłość", "Zdrada", "Przygoda", "Dramat", "Komedia"];
  const params = await searchParams;
  const page = Number(params?.page ?? 1) || 1;
  const tag = typeof params?.tag === "string" ? params.tag : undefined;
  const sort = typeof params?.sort === "string" ? params.sort : undefined;

  const validSort =
    sort && ["newest", "popular", "most_commented"].includes(sort)
      ? (sort as "newest" | "popular" | "most_commented")
      : "newest"; // domyślnie newest

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [postsRes, trendingTags] = await Promise.all([
    getPostsWithCookie(
      {
        page,
        limit: 10,
        tag,
        sortBy: validSort, // Użyj validSort zamiast sort
      },
      cookieHeader
    ),
    getTrendingTags(),
  ]);

  const stories: StoryListItem[] = postsRes.data.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.content,
    author: p.author.nickname,
    timestamp: p.createdAt,
    category: "none",
    isAnonymous: false,
    likesCount: p.likesCount,
    isLiked: p.isLiked,
  }));

  const baseQuery = (
    next: Partial<{ page: number; tag?: string; sort?: string }>
  ) => {
    const sp = new URLSearchParams();
    const nextPage = next.page ?? page;
    const nextTag = next.tag === undefined ? tag : next.tag;
    const nextSort = next.sort === undefined ? sort : next.sort;
    sp.set("page", String(nextPage));
    if (nextTag) sp.set("tag", nextTag);
    if (nextSort) sp.set("sort", nextSort);
    return `?${sp.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background-subtle">
      <main className="flex justify-center items-start py-5 px-6 md:px-10">
        <div className="flex w-full max-w-[1280px] gap-4">
          <aside className="hidden md:flex flex-col w-80 shrink-0">
            <FilterLayout
              title="Filtry"
              variant="row"
              className="bg-background-paper"
            >
              <div className="flex flex-row flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t}
                    href={baseQuery({ page: 1, tag: t })}
                    className={`inline-flex items-center justify-center h-8 px-4 rounded-full bg-ui-notification text-content-primary font-jakarta text-[14px] leading-[21px] ${
                      t === tag ? "ring-2 ring-accent-primary" : ""
                    }`}
                  >
                    {t}
                  </Link>
                ))}
                {tag && (
                  <Link
                    href={baseQuery({ page: 1, tag: undefined })}
                    className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-ui-notification text-content-secondary font-jakarta text-[14px] leading-[21px]"
                  >
                    Wyczyść
                  </Link>
                )}
              </div>
            </FilterLayout>

            <FilterLayout
              title="Popularność"
              className="bg-background-paper mt-2"
            >
              <SortOptions />
            </FilterLayout>
          </aside>

          <section className="flex-1">
            <StoriesLayout stories={stories} />

            <Pagination
              totalPages={postsRes.meta.totalPages}
              currentPage={page}
              className="mt-2"
            />
          </section>

          <TrendingSidebar
            items={trendingTags.map((t) => ({ tag: t.tag, count: t.count }))}
          />
        </div>
      </main>
    </div>
  );
}
