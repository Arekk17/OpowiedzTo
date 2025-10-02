import { PostFiltersData } from "@/types/post";

type FilterParams = {
  page?: number;
  limit?: number;
  cursor?: string;
  tag?: string;
  authorId?: string;
  sortBy?: string;
};

export const buildParams = (filters: FilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", filters.page.toString());
  if (filters.limit) params.set("limit", filters.limit.toString());
  if (filters.cursor) params.set("cursor", filters.cursor);
  if (filters.authorId?.trim()) params.set("authorId", filters.authorId.trim());
  if (filters.tag?.trim()) params.set("tag", filters.tag.trim());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);

  return params;
};

export const buildQueryParams = (filters: PostFiltersData): URLSearchParams => {
  return buildParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    authorId: filters.authorId,
    tag: filters.tag,
  });
};

export const buildCursorParams = (filters: {
  cursor?: string;
  limit?: number;
  tag?: string;
  authorId?: string;
  sortBy?: string;
}): URLSearchParams => {
  return buildParams(filters);
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
