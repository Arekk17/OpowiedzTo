"use client";

import { StoriesLayout } from "@/components/organisms/layout/StoriesLayout";
import { mapPostToStoryItem } from "@/helpers/mappers";
import { Post } from "@/types/post";

export function UserFeed({
  posts,
  isSearching = true,
}: {
  posts: Post[];
  isSearching?: boolean;
}) {
  const items = posts.map(mapPostToStoryItem);

  return (
    <div className="w-full max-w-[900px]">
      <StoriesLayout stories={items} isSearching={isSearching} />
    </div>
  );
}
