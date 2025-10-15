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
import { Metadata } from "next";
import { getAuthUser } from "@/lib/auth-ssr";

export const metadata: Metadata = {
  title: "Strona główna",
  description: "Strona główna",
  openGraph: {
    title: "Strona główna",
    description: "Strona główna",
    type: "website",
    url: "https://opowiedzto.pl",
    siteName: "Opowiedzto",
  },
};

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

  const [initialPage, trendingTags, tags, user] = await Promise.all([
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
    getAuthUser(),
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

        <FilterLayout title="Popularność" className="bg-background-paper mt-2">
          <SortOptions />
        </FilterLayout>
      </aside>

      <section className="flex-1 min-w-0">
        <Feed
          tag={tag}
          sortBy={validSort}
          pageSize={10}
          initialPage={initialPage}
          currentUserId={user?.id}
        />
      </section>

      <TrendingSidebar
        className="sticky top-[84px] self-start"
        items={trendingTags.map((t) => ({ tag: t.tag, count: t.count }))}
      />
    </PageLayout>
  );
}
