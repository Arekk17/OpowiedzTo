import { PostFiltersData } from "@/types/post";

export const buildQueryParams = (filters: PostFiltersData): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("page", (filters.page || 1).toString());
  params.set("limit", (filters.limit || 10).toString());
  if (filters.authorId?.trim()) params.set("authorId", filters.authorId.trim());
  if (filters.tag?.trim()) params.set("tag", filters.tag.trim());
  return params;
};

export const buildCursorParams = (filters: {
  cursor?: string;
  limit?: number;
  tag?: string;
  authorId?: string;
  sortBy?: string;
}): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.cursor) params.set("cursor", filters.cursor);
  if (filters.authorId?.trim()) params.set("authorId", filters.authorId.trim());
  if (filters.tag?.trim()) params.set("tag", filters.tag.trim());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  return params;
};

export const updateSearchParams = (
  sp: URLSearchParams,
  patch: Record<string, string | undefined | null>
): URLSearchParams => {
  const next = new URLSearchParams(sp.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === null || v === "") next.delete(k);
    else next.set(k, v);
  }
  next.delete("page");
  return next;
};
