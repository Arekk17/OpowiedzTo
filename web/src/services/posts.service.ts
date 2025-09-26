import { apiClient, createServerApi } from "@/lib/api/client";
import { POSTS_ENDPOINTS } from "@/lib/config/api";
import {
  Post,
  PostFiltersData,
  SearchPostsData,
  CreatePostFormData,
  UpdatePostFormData,
  TrendingTags,
} from "@/types/post";

export interface PostsApiResponse {
  data: Post[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const buildQueryParams = (filters: PostFiltersData): URLSearchParams => {
  const params = new URLSearchParams();

  params.set("page", (filters.page || 1).toString());
  params.set("limit", (filters.limit || 10).toString());

  if (filters.authorId?.trim()) {
    params.set("authorId", filters.authorId);
  }

  if (filters.tag?.trim()) {
    params.set("tag", filters.tag);
  }

  return params;
};

export const getPosts = async (
  filters: PostFiltersData
): Promise<PostsApiResponse> => {
  try {
    const params = buildQueryParams(filters);

    return await apiClient.get<PostsApiResponse>(
      `${POSTS_ENDPOINTS.list}?${params.toString()}`
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania postów"
    );
  }
};

// Server-only variant: pass cookie header so backend can compute isLiked/likesCount for current user
export const getPostsWithCookie = async (
  filters: PostFiltersData,
  cookieHeader: string
): Promise<PostsApiResponse> => {
  try {
    const params = buildQueryParams(filters);
    console.log(
      `getPostsWithCookie: cookieHeader=${cookieHeader.substring(0, 50)}...`
    );
    const serverApi = createServerApi(cookieHeader);
    const result = await serverApi.get<PostsApiResponse>(
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
    return await apiClient.get<TrendingTags[]>(POSTS_ENDPOINTS.trendingTags);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania tagów"
    );
  }
};

export interface SearchPostsApiResponse extends PostsApiResponse {
  meta: PostsApiResponse["meta"] & {
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
