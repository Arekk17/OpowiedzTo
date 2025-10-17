import * as Comments from "@/services/comments.service";
import { apiRequest } from "@/lib/auth";
import { COMMENTS_ENDPOINTS } from "@/lib/config/api";

jest.mock("@/lib/auth", () => ({ apiRequest: jest.fn() }));

describe("commentsService", () => {
  it("getComments: default limit 10 and method=GET", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({});
    await Comments.getComments("p1");
    expect(apiRequest).toHaveBeenCalledWith(
      `${COMMENTS_ENDPOINTS.list("p1")}?limit=10`,
      { method: "GET" },
    );
  });
  it("getComments: niestandardowy limit oraz cookieHeader przechodzą do opcji", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce([]);
    await Comments.getComments("p1", { limit: 25, cookieHeader: "a=b" });
    expect(apiRequest).toHaveBeenCalledWith(
      `${COMMENTS_ENDPOINTS.list("p1")}?limit=25`,
      { method: "GET", cookieHeader: "a=b", limit: 25 },
    );
  });
  it("createComment: POST z JSON body", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({ id: "c1" });
    await Comments.createComment("p1", {
      content: "hello",
    });
    expect(apiRequest).toHaveBeenCalledWith(COMMENTS_ENDPOINTS.create("p1"), {
      method: "POST",
      body: JSON.stringify({ content: "hello" }),
    });
  });

  it("deleteComment: DELETE", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);
    await Comments.deleteComment("c1");
    expect(apiRequest).toHaveBeenCalledWith(COMMENTS_ENDPOINTS.delete("c1"), {
      method: "DELETE",
    });
  });
});
