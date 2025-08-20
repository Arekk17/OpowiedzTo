import { PostFiltersData, SearchPostsData } from "@/types/post";

export const buildQueryParams = (filters: PostFiltersData): URLSearchParams => {
  const params = new URLSearchParams();

  params.set("page", (filters.page || 1).toString());
  params.set("limit", (filters.limit || 10).toString());

  if (filters.authorId?.trim()) {
    params.set("authorId", filters.authorId.trim());
  }

  if (filters.tag?.trim()) {
    params.set("tag", filters.tag.trim());
  }

  return params;
};
export const buildSearchParams = (
  searchData: SearchPostsData
): URLSearchParams => {
  const params = new URLSearchParams();

  if (!searchData.q?.trim()) {
    throw new Error("Termin wyszukiwania jest wymagany");
  }

  params.set("q", searchData.q.trim());
  params.set("page", (searchData.page || 1).toString());
  params.set("limit", (searchData.limit || 10).toString());

  return params;
};
