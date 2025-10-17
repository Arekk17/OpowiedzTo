import * as Posts from "@/services/posts.service";
import { apiRequest } from "@/lib/auth";
import { POSTS_ENDPOINTS, TAGS_ENDPOINTS } from "@/lib/config/api";
import type {
  PostFiltersData,
  SearchPostsData,
  CreatePostFormData,
  UpdatePostFormData,
} from "@/types/post";
type CursorFilters = Omit<PostFiltersData, "page"> & { cursor?: string };

jest.mock("@/lib/auth", () => ({ apiRequest: jest.fn() }));

describe("posts.service", () => {
  it("getPostsCursor: adapts flat response to meta.nextCursor", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: [{ id: "1" }],
      nextCursor: "abc",
    });
    const res = await Posts.getPostsCursor({
      cursor: "c1",
    } as CursorFilters);
    expect(apiRequest).toHaveBeenCalledWith(
      expect.stringMatching(/^\/posts\?/),
      expect.objectContaining({ method: "GET" })
    );
    expect(res).toEqual({ data: [{ id: "1" }], meta: { nextCursor: "abc" } });
  });

  it("getPostsCursor: keeps meta-shaped response as is", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: [],
      meta: { nextCursor: null },
    });
    const res = await Posts.getPostsCursor({} as CursorFilters);
    expect(res).toEqual({ data: [], meta: { nextCursor: null } });
  });

  it("getPosts: builds query from filters", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: [],
      meta: { page: 2, total: 0 },
    });
    await Posts.getPosts({ page: 2, limit: 20 } as PostFiltersData);
    const url = (apiRequest as jest.Mock).mock.calls[0][0] as string;
    expect(url).toMatch(/^\/posts\?/);
    expect(url).toContain("page=2");
    expect(url).toContain("limit=20");
  });

  it("getPosts: forwards cookieHeader in options", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: [],
      meta: { page: 1, total: 0 },
    });
    await Posts.getPosts({ page: 1 } as PostFiltersData, {
      cookieHeader: "a=b",
    });
    const [, opts] = (apiRequest as jest.Mock).mock.calls[0];
    expect(opts).toMatchObject({ method: "GET", cookieHeader: "a=b" });
  });

  it("getPost: GET with cookieHeader (SSR)", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ id: "p1" });
    await Posts.getPost("p1", { cookieHeader: "sid=1" });
    expect(apiRequest).toHaveBeenCalledWith(POSTS_ENDPOINTS.detail("p1"), {
      method: "GET",
      cookieHeader: "sid=1",
    });
  });

  it("getTrendingTags: GET", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce([]);
    await Posts.getTrendingTags();
    expect(apiRequest).toHaveBeenCalledWith(TAGS_ENDPOINTS.trending, {
      method: "GET",
    });
  });

  it("getTags: default limit=10", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ data: [] });
    await Posts.getTags();
    const url = (apiRequest as jest.Mock).mock.calls[0][0] as string;
    expect(url).toBe(`${TAGS_ENDPOINTS.list}?limit=10`);
  });

  it("getTags: custom limit and cookieHeader", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ data: [] });
    await Posts.getTags({ limit: 25, cookieHeader: "a=b" });
    const [url, opts] = (apiRequest as jest.Mock).mock.calls[0];
    expect(url).toBe(`${TAGS_ENDPOINTS.list}?limit=25`);
    expect(opts).toMatchObject({ method: "GET", cookieHeader: "a=b" });
  });

  it("searchPosts: sets q and defaults page=1, limit=10", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: [],
      meta: { page: 1, total: 0, searchTerm: "abc" },
    });
    await Posts.searchPosts({ q: "abc" } as SearchPostsData);
    const url = (apiRequest as jest.Mock).mock.calls[0][0] as string;
    expect(url).toMatch(/^\/posts\/search\?/);
    expect(url).toContain("q=abc");
    expect(url).toContain("page=1");
    expect(url).toContain("limit=10");
  });

  it("createPost: POST with JSON body", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ id: "p1" });
    await Posts.createPost({ title: "t" } as CreatePostFormData);
    expect(apiRequest).toHaveBeenCalledWith(POSTS_ENDPOINTS.create, {
      method: "POST",
      body: JSON.stringify({ title: "t" }),
    });
  });

  it("updatePost: PATCH with JSON body", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ id: "p1", title: "t2" });
    await Posts.updatePost("p1", { title: "t2" } as UpdatePostFormData);
    expect(apiRequest).toHaveBeenCalledWith(POSTS_ENDPOINTS.update("p1"), {
      method: "PATCH",
      body: JSON.stringify({ title: "t2" }),
    });
  });

  it("deletePost: DELETE", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);
    await Posts.deletePost("p1");
    expect(apiRequest).toHaveBeenCalledWith(POSTS_ENDPOINTS.delete("p1"), {
      method: "DELETE",
    });
  });
});
