import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const likePost = jest.fn<Promise<void>, [string]>(() => Promise.resolve());
const unlikePost = jest.fn<Promise<void>, [string]>(() => Promise.resolve());

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

jest.mock("@/services/likes.service", () => ({
  likePost: (id: string) => likePost(id),
  unlikePost: (id: string) => unlikePost(id),
}));

import { useLike } from "@/hooks/useLike";

describe("useLike", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("toggles like on -> optimistic + calls likePost", async () => {
    const { result } = renderHook(() => useLike("p1", false, 0), { wrapper });

    await act(async () => {
      result.current.toggle();
    });

    await waitFor(() => expect(result.current.liked).toBe(true));
    await waitFor(() => expect(result.current.count).toBe(1));
    await waitFor(() => expect(likePost).toHaveBeenCalledWith("p1"));
  });
  it("toggles like off -> optimistic + calls unlikePost", async () => {
    const { result } = renderHook(() => useLike("p1", true, 1), { wrapper });
    await act(async () => {
      result.current.toggle();
    });
    await waitFor(() => expect(result.current.liked).toBe(false));
    await waitFor(() => expect(result.current.count).toBe(0));
    await waitFor(() => expect(unlikePost).toHaveBeenCalledWith("p1"));
  });
  it("onError 400 with 'polubiłeś' -> optimistic + doesn't call likePost", async () => {
    likePost.mockImplementationOnce(() =>
      Promise.reject({ statusCode: 400, message: "Już polubiłeś ten post" })
    );
    const { result } = renderHook(() => useLike("p1", false, 0), { wrapper });

    await act(async () => {
      result.current.toggle();
    });

    await waitFor(() => {
      expect(result.current.liked).toBe(true);
      expect(result.current.count).toBeGreaterThanOrEqual(1);
    });
  });
  it("onError 404 with 'Nie polubiłeś' keeps liked = false and count >= 0", async () => {
    unlikePost.mockImplementationOnce(() =>
      Promise.reject({ statusCode: 404, message: "Nie polubiłeś tego posta" })
    );
    const { result } = renderHook(() => useLike("p1", true, 1), { wrapper });
    await act(async () => {
      result.current.toggle();
    });
    await waitFor(() => {
      expect(result.current.liked).toBe(false);
      expect(result.current.count).toBeGreaterThanOrEqual(0);
    });
  });
  it("onError generic reverts to previous state from context", async () => {
    likePost.mockImplementationOnce(() =>
      Promise.reject({ statusCode: 500, message: "Oops" })
    );

    const { result } = renderHook(() => useLike("p1", false, 5), { wrapper });

    await act(async () => {
      result.current.toggle();
    });

    await waitFor(() => {
      expect(result.current.liked).toBe(false);
      expect(result.current.count).toBe(5);
    });
  });

  it("updates state when input props change (postId/initialLiked/initialCount)", () => {
    const { result, rerender } = renderHook(
      (p: { id: string; liked: boolean; count: number }) =>
        useLike(p.id, p.liked, p.count),
      { initialProps: { id: "p1", liked: false, count: 2 }, wrapper }
    );

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(2);

    rerender({ id: "p2", liked: true, count: 10 });
    expect(result.current.liked).toBe(true);
    expect(result.current.count).toBe(10);
  });
});
