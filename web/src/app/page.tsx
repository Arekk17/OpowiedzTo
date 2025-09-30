import React from "react";
import { FilterLayout } from "@/components/molecules/layout/FilterLayout";
import { TrendingSidebar } from "@/components/organisms/layout/TrendingSidebar";
import { SortOptions } from "@/components/molecules/forms/SortOptions";
import {
  getTrendingTags,
  getPostsCursorWithCookie,
} from "@/services/posts.service";
import Link from "next/link";
import { cookies } from "next/headers";
import { Feed } from "@/components/organisms/story/Feed";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tags: string[] = ["Miłość", "Zdrada", "Przygoda", "Dramat", "Komedia"];
  const params = await searchParams;
  const tag = typeof params?.tag === "string" ? params.tag : undefined;
  const sort = typeof params?.sort === "string" ? params.sort : undefined;

  const validSort = (
    sort && ["newest", "popular", "most_commented"].includes(sort)
      ? sort
      : "newest"
  ) as "newest" | "popular" | "most_commented";

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [initialPage, trendingTags] = await Promise.all([
    getPostsCursorWithCookie(
      {
        limit: 10,
        tag,
        sortBy: validSort,
      },
      cookieHeader
    ),
    getTrendingTags(),
  ]);

  const baseQuery = (next: Partial<{ tag?: string; sort?: string }>) => {
    const sp = new URLSearchParams();
    const nextTag = next.tag === undefined ? tag : next.tag;
    const nextSort = next.sort === undefined ? sort : next.sort;
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
                    href={baseQuery({ tag: t })}
                    className={`inline-flex items-center justify-center h-8 px-4 rounded-full bg-ui-notification text-content-primary font-jakarta text-[14px] leading-[21px] ${
                      t === tag ? "ring-2 ring-accent-primary" : ""
                    }`}
                  >
                    {t}
                  </Link>
                ))}
                {tag && (
                  <Link
                    href={baseQuery({ tag: undefined })}
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
            <Feed
              tag={tag}
              sortBy={validSort}
              pageSize={10}
              initialPage={initialPage}
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
