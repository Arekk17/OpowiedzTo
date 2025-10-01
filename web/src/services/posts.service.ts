import { buildCursorParams, buildQueryParams } from "@/helpers/buildParams";
import { apiClient, createServerApi } from "@/lib/api/client";
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

export const getPostsCursor = async (
  filters: CursorFilters
): Promise<PostsCursorResponse> => {
  const params = buildCursorParams(filters);
  const res = await apiClient.get<
    PostsCursorResponse | { data: Post[]; nextCursor: string | null }
  >(`${POSTS_ENDPOINTS.list}?${params.toString()}`);
  return adaptCursorResponse(res);
};

export const getPostsCursorWithCookie = async (
  filters: CursorFilters,
  cookieHeader: string
): Promise<PostsCursorResponse> => {
  const params = buildCursorParams(filters);
  const serverApi = createServerApi(cookieHeader);
  const res = await serverApi.get<
    PostsCursorResponse | { data: Post[]; nextCursor: string | null }
  >(`${POSTS_ENDPOINTS.list}?${params.toString()}`);
  return adaptCursorResponse(res);
};

export const getPosts = async (
  filters: PostFiltersData
): Promise<PaginatedResponse<Post>> => {
  try {
    const params = buildQueryParams(filters);

    return await apiClient.get<PaginatedResponse<Post>>(
      `${POSTS_ENDPOINTS.list}?${params.toString()}`
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania postów"
    );
  }
};

export const getPostsWithCookie = async (
  filters: PostFiltersData,
  cookieHeader: string
): Promise<PaginatedResponse<Post>> => {
  try {
    const params = buildQueryParams(filters);
    console.log(
      `getPostsWithCookie: cookieHeader=${cookieHeader.substring(0, 50)}...`
    );
    const serverApi = createServerApi(cookieHeader);
    const result = await serverApi.get<PaginatedResponse<Post>>(
      `${POSTS_ENDPOINTS.list}?${params.toString()}`
    );
    console.log(`getPostsWithCookie: got ${result.data.length} posts`);
    if (result.data.length > 0) {
      console.log(
        `First post: isLiked=${result.data[0].isLiked}, likesCount=${result.data[0].likesCount}`
      );
    }
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania postów (server)"
    );
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    return await apiClient.get<Post>(POSTS_ENDPOINTS.detail(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania postu"
    );
  }
};
export const getTrendingTags = async (): Promise<TrendingTags[]> => {
  try {
    return await apiClient.get<TrendingTags[]>(TAGS_ENDPOINTS.trending);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania tagów"
    );
  }
};

export const getTags = async ({
  limit,
}: {
  limit?: number;
}): Promise<TagsResponse> => {
  try {
    return await apiClient.get<TagsResponse>(
      `${TAGS_ENDPOINTS.list}?limit=${limit}`
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania tagów"
    );
  }
};

export interface SearchPostsApiResponse extends PaginatedResponse<Post> {
  meta: PaginatedResponse<Post>["meta"] & {
    searchTerm: string;
  };
}

export const searchPosts = async (
  searchData: SearchPostsData
): Promise<SearchPostsApiResponse> => {
  try {
    const params = new URLSearchParams();
    params.set("q", searchData.q);
    params.set("page", (searchData.page || 1).toString());
    params.set("limit", (searchData.limit || 10).toString());

    return await apiClient.get<SearchPostsApiResponse>(
      `${POSTS_ENDPOINTS.search}?${params.toString()}`
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd wyszukiwania postów"
    );
  }
};

export const createPost = async (data: CreatePostFormData): Promise<Post> => {
  try {
    return await apiClient.post<Post>(POSTS_ENDPOINTS.create, data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd tworzenia postu"
    );
  }
};

export const updatePost = async (
  id: string,
  data: UpdatePostFormData
): Promise<Post> => {
  try {
    return await apiClient.patch<Post>(POSTS_ENDPOINTS.update(id), data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd aktualizacji postu"
    );
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(POSTS_ENDPOINTS.delete(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd usuwania postu"
    );
  }
};
