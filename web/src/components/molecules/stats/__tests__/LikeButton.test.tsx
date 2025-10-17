import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let pendingResolve: (() => void) | null = null;
const likePost = jest.fn<Promise<void>, [string]>(() => {
  return new Promise((resolve) => {
    pendingResolve = () => resolve();
  });
});
const unlikePost = jest.fn<Promise<void>, [string]>(() => Promise.resolve());

jest.mock("@/services/likes.service", () => ({
  likePost: (id: string) => likePost(id),
  unlikePost: (id: string) => unlikePost(id),
}));

import { LikeButton } from "@/components/molecules/stats/LikeButton";

describe("LikeButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pendingResolve = null;
  });
  function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }

  it("renders count and aria state, toggles on click", async () => {
    render(<LikeButton postId="p1" initialLiked={false} initialCount={0} />, {
      wrapper,
    });

    const btn = screen.getByRole("button", { name: /Polub/i });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("0")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btn);
    });

    await waitFor(() => {
      expect(btn).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    expect(likePost).toHaveBeenCalledWith("p1");
  });

  it("disables during pending mutation", async () => {
    render(<LikeButton postId="p1" initialLiked={false} initialCount={0} />, {
      wrapper,
    });

    const btn = screen.getByRole("button", { name: /Polub/i });
    fireEvent.click(btn);

    await waitFor(() => expect(btn).toBeDisabled());

    pendingResolve?.();

    await waitFor(() => expect(btn).not.toBeDisabled());
  });
});
