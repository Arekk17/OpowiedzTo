import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gender } from "@/types/auth";
import { User } from "@/types/user";

// Mock services PRZED importem hooka
jest.mock("@/services/comments.service", () => ({
  getComments: jest.fn(() => Promise.resolve([])),
  createComment: jest.fn(() => Promise.resolve({})),
}));

// Mock useAuth PRZED importem hooka
const mockUseAuth = jest.fn();
jest.mock("../useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Teraz importujemy hook
import { useComments } from "../useComments";
import * as commentsService from "@/services/comments.service";

// Test data
const mockUser: User = {
  id: "u1",
  email: "test@example.com",
  nickname: "TestUser",
  gender: Gender.MALE,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockComments = [
  {
    id: "c1",
    postId: "p1",
    authorId: "u1",
    content: "First comment",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    author: mockUser,
  },
  {
    id: "c2",
    postId: "p1",
    authorId: "u2",
    content: "Second comment",
    createdAt: "2023-01-01T01:00:00Z",
    updatedAt: "2023-01-01T01:00:00Z",
    author: { ...mockUser, id: "u2", nickname: "User2" },
  },
];

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useComments", () => {
  const mockGetComments = commentsService.getComments as jest.MockedFunction<
    typeof commentsService.getComments
  >;
  const mockCreateComment =
    commentsService.createComment as jest.MockedFunction<
      typeof commentsService.createComment
    >;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock useAuth
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signin: jest.fn(),
      signup: jest.fn(),
      signout: jest.fn(),
      signinError: null,
      signupError: null,
      isLoading: false,
      isSigningIn: false,
      isSigningUp: false,
      isSigningOut: false,
      refetch: jest.fn(),
    });
  });

  describe("query behavior", () => {
    it("fetches comments from API when enabled and no initialData", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      renderHook(() => useComments("p1"), { wrapper });

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledWith("p1", {
            limit: undefined,
          });
        },
        { timeout: 3000 },
      );
    });

    it("uses initialComments when provided (no API call)", async () => {
      const initialComments = [mockComments[0]];
      mockGetComments.mockResolvedValue([]);

      const { result } = renderHook(() => useComments("p1", initialComments), {
        wrapper,
      });

      // Z initialData React Query nie wywołuje API
      expect(result.current.comments).toEqual(initialComments);
      expect(mockGetComments).not.toHaveBeenCalled();
    });

    it("disables query when enabled=false", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      renderHook(() => useComments("p1", [], undefined, { enabled: false }), {
        wrapper,
      });

      // Query nie powinien się wykonać
      await waitFor(
        () => {
          expect(mockGetComments).not.toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    it("disables query when postId is empty", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      renderHook(() => useComments(""), { wrapper });

      await waitFor(
        () => {
          expect(mockGetComments).not.toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    it("creates correct query key with different limits", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      const { rerender } = renderHook(
        ({ limit }: { limit: number }) => useComments("p1", [], limit),
        { initialProps: { limit: 10 }, wrapper },
      );

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledWith("p1", { limit: 10 });
        },
        { timeout: 3000 },
      );

      // Zmień limit - to spowoduje nowy query
      rerender({ limit: 20 });

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledWith("p1", { limit: 20 });
        },
        { timeout: 3000 },
      );
    });

    it("refetch works correctly", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      const { result } = renderHook(() => useComments("p1"), { wrapper });

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledTimes(1);
        },
        { timeout: 3000 },
      );

      act(() => {
        result.current.refetch();
      });

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledTimes(2);
        },
        { timeout: 3000 },
      );
    });
  });

  describe("addComment mutation", () => {
    it("performs optimistic update when adding comment", async () => {
      mockGetComments.mockResolvedValue(mockComments);
      mockCreateComment.mockImplementation(() => new Promise(() => {})); // Pending

      const { result } = renderHook(() => useComments("p1", mockComments), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.comments).toEqual(mockComments);
      });

      const newCommentData = { content: "New comment" };

      act(() => {
        result.current.addComment(newCommentData);
      });

      // Sprawdź czy optimistic comment został dodany
      await waitFor(
        () => {
          expect(result.current.comments).toHaveLength(3);
          expect(result.current.comments[0].id).toMatch(/^temp-/);
          expect(result.current.comments[0].content).toBe("New comment");
          expect(result.current.comments[0].authorId).toBe("u1");
        },
        { timeout: 3000 },
      );
    });

    it("replaces temp comment with real one on success", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      const realComment = {
        id: "c3",
        postId: "p1",
        authorId: "u1",
        content: "New comment",
        createdAt: "2023-01-01T02:00:00Z",
        updatedAt: "2023-01-01T02:00:00Z",
        author: mockUser,
      };

      mockCreateComment.mockResolvedValue(realComment);

      // Używaj hooka bez initialData, żeby optimistic updates działały
      const { result } = renderHook(() => useComments("p1"), {
        wrapper,
      });

      // Poczekaj aż hook się załaduje z API
      await waitFor(() => {
        expect(result.current.comments).toEqual(mockComments);
      });

      act(() => {
        result.current.addComment({ content: "New comment" });
      });

      // Sprawdź czy mutation się wykonała
      await waitFor(() => {
        expect(mockCreateComment).toHaveBeenCalledWith("p1", {
          content: "New comment",
        });
      });

      // Po success powinien być prawdziwy komentarz
      await waitFor(
        () => {
          expect(result.current.comments[0]).toEqual(realComment);
          expect(result.current.comments[0].id).not.toMatch(/^temp-/);
        },
        { timeout: 3000 },
      );
    });

    it("reverts to previous state on error", async () => {
      mockGetComments.mockResolvedValue(mockComments);
      mockCreateComment.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useComments("p1", mockComments), {
        wrapper,
      });

      // Poczekaj aż hook się załaduje z initialComments
      expect(result.current.comments).toEqual(mockComments);

      act(() => {
        result.current.addComment({ content: "New comment" });
      });

      // Sprawdź czy mutation się wykonała
      await waitFor(() => {
        expect(mockCreateComment).toHaveBeenCalledWith("p1", {
          content: "New comment",
        });
      });

      // Po error hook powinien wrócić do poprzedniego stanu
      await waitFor(
        () => {
          expect(result.current.comments).toEqual(mockComments);
        },
        { timeout: 3000 },
      );
    });

    it("shows pending state during mutation", async () => {
      mockGetComments.mockResolvedValue(mockComments);
      mockCreateComment.mockImplementation(() => new Promise(() => {})); // Pending

      const { result } = renderHook(() => useComments("p1"), { wrapper });

      act(() => {
        result.current.addComment({ content: "New comment" });
      });

      await waitFor(
        () => {
          expect(result.current.isPending).toBe(true);
        },
        { timeout: 3000 },
      );
    });

    it("creates optimistic comment with user data", async () => {
      mockGetComments.mockResolvedValue(mockComments);
      mockCreateComment.mockImplementation(() => new Promise(() => {})); // Pending

      const { result } = renderHook(() => useComments("p1", mockComments), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.comments).toEqual(mockComments);
      });

      act(() => {
        result.current.addComment({ content: "New comment" });
      });

      await waitFor(
        () => {
          const optimisticComment = result.current.comments[0];
          expect(optimisticComment.authorId).toBe("u1");
          expect(optimisticComment.author.id).toBe("u1");
          expect(optimisticComment.author.email).toBe("test@example.com");
          expect(optimisticComment.author.nickname).toBe("TestUser");
        },
        { timeout: 3000 },
      );
    });

    it("handles missing user gracefully", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        signin: jest.fn(),
        signup: jest.fn(),
        signout: jest.fn(),
        signinError: null,
        signupError: null,
        isLoading: false,
        isSigningIn: false,
        isSigningUp: false,
        isSigningOut: false,
        refetch: jest.fn(),
      });

      mockGetComments.mockResolvedValue(mockComments);
      mockCreateComment.mockImplementation(() => new Promise(() => {})); // Pending

      const { result } = renderHook(() => useComments("p1", mockComments), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.comments).toEqual(mockComments);
      });

      act(() => {
        result.current.addComment({ content: "New comment" });
      });

      await waitFor(
        () => {
          const optimisticComment = result.current.comments[0];
          expect(optimisticComment.authorId).toBe("");
          expect(optimisticComment.author.id).toBe("");
          expect(optimisticComment.author.email).toBe("");
          expect(optimisticComment.author.nickname).toBe("Ty");
        },
        { timeout: 3000 },
      );
    });
  });

  describe("edge cases", () => {
    it("handles API errors gracefully", async () => {
      mockGetComments.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useComments("p1"), { wrapper });

      // Hook powinien działać nawet gdy API zwraca błąd
      expect(result.current.comments).toEqual([]);
      expect(result.current.addComment).toBeDefined();
      expect(result.current.refetch).toBeDefined();
    });

    it("works with different limits", async () => {
      mockGetComments.mockResolvedValue(mockComments);

      const { rerender } = renderHook(
        ({ limit }: { limit: number }) => useComments("p1", [], limit),
        { initialProps: { limit: 5 }, wrapper },
      );

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledWith("p1", { limit: 5 });
        },
        { timeout: 3000 },
      );

      // Zmień limit - to spowoduje nowy query
      rerender({ limit: 15 });

      await waitFor(
        () => {
          expect(mockGetComments).toHaveBeenCalledWith("p1", { limit: 15 });
        },
        { timeout: 3000 },
      );
    });

    it("handles empty comments array", async () => {
      mockGetComments.mockResolvedValue([]);

      const { result } = renderHook(() => useComments("p1"), { wrapper });

      await waitFor(() => {
        expect(result.current.comments).toEqual([]);
      });

      act(() => {
        result.current.addComment({ content: "First comment" });
      });

      await waitFor(
        () => {
          expect(result.current.comments).toHaveLength(1);
          expect(result.current.comments[0].content).toBe("First comment");
        },
        { timeout: 3000 },
      );
    });
  });
});
