import React from "react";
import { FilterLayout } from "@/components/molecules/layout/FilterLayout";
import { TrendingSidebar } from "@/components/organisms/layout/TrendingSidebar";
import { SortOptions } from "@/components/molecules/forms/SortOptions";
import {
  getTrendingTags,
  getPostsCursor,
  getTags,
} from "@/services/posts.service";
import { Feed } from "@/components/organisms/story/Feed";
import TagChips from "@/components/molecules/tags/TagChips";
import { PageLayout } from "@/components/organisms/layout/PageLayout";
import { cookies } from "next/headers";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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

  try {
    const [initialPage, trendingTags, tags] = await Promise.all([
      getPostsCursor(
        {
          limit: 10,
          tag,
          sortBy: validSort,
        },
        { cookieHeader }
      ),
      getTrendingTags({ cookieHeader }),
      getTags({ limit: 10, cookieHeader }),
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
      <PageLayout className="gap-6">
        <aside className="hidden md:flex flex-col md:w-64 lg:w-72 xl:w-80 shrink-0 sticky top-[84px] self-start">
          <FilterLayout
            title="Filtry"
            variant="row"
            className="bg-background-paper"
          >
            <TagChips
              tags={tags.data}
              activeTag={tag}
              makeHref={(slug) => baseQuery({ tag: slug })}
            />
          </FilterLayout>

          <FilterLayout
            title="Popularność"
            className="bg-background-paper mt-2"
          >
            <SortOptions />
          </FilterLayout>
        </aside>

        <section className="flex-1 min-w-0">
          <Feed
            tag={tag}
            sortBy={validSort}
            pageSize={10}
            initialPage={initialPage}
          />
        </section>

        <TrendingSidebar
          className="sticky top-[84px] self-start"
          items={trendingTags.map((t) => ({ tag: t.tag, count: t.count }))}
        />
      </PageLayout>
    );
  } catch (error) {
    console.error("Error loading home page:", error);

    // Fallback - wyświetl stronę bez danych
    return (
      <PageLayout className="gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-4">Witaj w OpowiedzTo!</h1>
            <p className="text-muted-foreground mb-4">
              Nie udało się załadować postów. Spróbuj odświeżyć stronę.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }
}
