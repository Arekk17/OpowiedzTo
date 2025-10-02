import { buildCursorParams, buildQueryParams } from "@/helpers/buildParams";
import { apiRequest } from "@/lib/auth";
import { POSTS_ENDPOINTS, TAGS_ENDPOINTS } from "@/lib/config/api";
import type { PaginatedResponse, ApiResponse, CursorMeta } from "@/types/api";
import {
  Post,
  PostFiltersData,
  SearchPostsData,
  CreatePostFormData,
  UpdatePostFormData,
  TrendingTags,
} from "@/types/post";
import { TagsResponse } from "@/types/tags";

export type PostsCursorResponse = ApiResponse<Post[], CursorMeta>;
type CursorFilters = Omit<PostFiltersData, "page"> & { cursor?: string };

const adaptCursorResponse = (
  res: PostsCursorResponse | { data: Post[]; nextCursor: string | null }
): PostsCursorResponse => {
  if ((res as PostsCursorResponse).meta) return res as PostsCursorResponse;
  const flat = res as { data: Post[]; nextCursor: string | null };
  return { data: flat.data, meta: { nextCursor: flat.nextCursor } };
};

type ApiOptions = {
  cookieHeader?: string;
};

export const getPostsCursor = async (
  filters: CursorFilters,
  options?: ApiOptions
): Promise<PostsCursorResponse> => {
  const params = buildCursorParams(filters);
  const res = await apiRequest<
    PostsCursorResponse | { data: Post[]; nextCursor: string | null }
  >(`${POSTS_ENDPOINTS.list}?${params.toString()}`, {
    method: "GET",
    ...options,
  });
  return adaptCursorResponse(res);
};

export const getPosts = async (
  filters: PostFiltersData,
  options?: ApiOptions
): Promise<PaginatedResponse<Post>> => {
  const params = buildQueryParams(filters);
  return apiRequest<PaginatedResponse<Post>>(
    `${POSTS_ENDPOINTS.list}?${params.toString()}`,
    {
      method: "GET",
      ...options,
    }
  );
};

export const getPost = async (
  id: string,
  options?: ApiOptions
): Promise<Post> => {
  return apiRequest<Post>(POSTS_ENDPOINTS.detail(id), {
    method: "GET",
    ...options,
  });
};

export const getTrendingTags = async (
  options?: ApiOptions
): Promise<TrendingTags[]> => {
  return apiRequest<TrendingTags[]>(TAGS_ENDPOINTS.trending, {
    method: "GET",
    ...options,
  });
};

export const getTags = async (
  options?: ApiOptions & { limit?: number }
): Promise<TagsResponse> => {
  const { limit, ...apiOptions } = options || {};
  return apiRequest<TagsResponse>(
    `${TAGS_ENDPOINTS.list}?limit=${limit || 10}`,
    {
      method: "GET",
      ...apiOptions,
    }
  );
};

export interface SearchPostsApiResponse extends PaginatedResponse<Post> {
  meta: PaginatedResponse<Post>["meta"] & {
    searchTerm: string;
  };
}

export const searchPosts = async (
  searchData: SearchPostsData,
  options?: ApiOptions
): Promise<SearchPostsApiResponse> => {
  const params = new URLSearchParams();
  params.set("q", searchData.q);
  params.set("page", (searchData.page || 1).toString());
  params.set("limit", (searchData.limit || 10).toString());

  return apiRequest<SearchPostsApiResponse>(
    `${POSTS_ENDPOINTS.search}?${params.toString()}`,
    {
      method: "GET",
      ...options,
    }
  );
};

export const createPost = async (
  data: CreatePostFormData,
  options?: ApiOptions
): Promise<Post> => {
  return apiRequest<Post>(POSTS_ENDPOINTS.create, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });
};

export const updatePost = async (
  id: string,
  data: UpdatePostFormData,
  options?: ApiOptions
): Promise<Post> => {
  return apiRequest<Post>(POSTS_ENDPOINTS.update(id), {
    method: "PATCH",
    body: JSON.stringify(data),
    ...options,
  });
};

export const deletePost = async (
  id: string,
  options?: ApiOptions
): Promise<void> => {
  return apiRequest(POSTS_ENDPOINTS.delete(id), {
    method: "DELETE",
    ...options,
  });
};
