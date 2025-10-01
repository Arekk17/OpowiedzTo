import { buildCursorParams, buildQueryParams } from "@/helpers/buildParams";
import { api } from "@/lib/api/client";
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
  const res = await api.get<
    PostsCursorResponse | { data: Post[]; nextCursor: string | null }
  >(`${POSTS_ENDPOINTS.list}?${params.toString()}`, options);
  return adaptCursorResponse(res);
};

export const getPosts = async (
  filters: PostFiltersData,
  options?: ApiOptions
): Promise<PaginatedResponse<Post>> => {
  const params = buildQueryParams(filters);
  return api.get<PaginatedResponse<Post>>(
    `${POSTS_ENDPOINTS.list}?${params.toString()}`,
    options
  );
};

export const getPost = async (
  id: string,
  options?: ApiOptions
): Promise<Post> => {
  return api.get<Post>(POSTS_ENDPOINTS.detail(id), options);
};

export const getTrendingTags = async (
  options?: ApiOptions
): Promise<TrendingTags[]> => {
  return api.get<TrendingTags[]>(TAGS_ENDPOINTS.trending, options);
};

export const getTags = async (
  options?: ApiOptions & { limit?: number }
): Promise<TagsResponse> => {
  const { limit, ...apiOptions } = options || {};
  return api.get<TagsResponse>(
    `${TAGS_ENDPOINTS.list}?limit=${limit || 10}`,
    apiOptions
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

  return api.get<SearchPostsApiResponse>(
    `${POSTS_ENDPOINTS.search}?${params.toString()}`,
    options
  );
};

export const createPost = async (
  data: CreatePostFormData,
  options?: ApiOptions
): Promise<Post> => {
  return api.post<Post>(POSTS_ENDPOINTS.create, data, options);
};

export const updatePost = async (
  id: string,
  data: UpdatePostFormData,
  options?: ApiOptions
): Promise<Post> => {
  return api.patch<Post>(POSTS_ENDPOINTS.update(id), data, options);
};

export const deletePost = async (
  id: string,
  options?: ApiOptions
): Promise<void> => {
  return api.delete(POSTS_ENDPOINTS.delete(id), options);
};
