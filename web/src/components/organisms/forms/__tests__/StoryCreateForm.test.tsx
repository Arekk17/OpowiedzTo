import React from "react";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryCreateForm, StoryCreateFormValues } from "../StoryCreateForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/components/molecules/preview/StoryPreview", () => ({
  StoryPreview: () => null,
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("StoryCreateForm", () => {
  const setup = (overrides?: Partial<StoryCreateFormValues>) => {
    const onSubmit = jest.fn();
    renderWithProviders(
      <StoryCreateForm
        options={["tag1", "tag2"]}
        defaultValues={overrides}
        onSubmit={onSubmit}
      />
    );
    return { onSubmit };
  };

  test("pokazuje błędy walidacji przy pustym submicie", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: /opublikuj/i }));

    expect(await screen.findAllByText(/minimum 3 znaki/i)).not.toHaveLength(0);
    expect(await screen.findAllByText(/minimum 20 znaków/i)).not.toHaveLength(
      0
    );
    expect(
      await screen.findByText(/wybierz co najmniej 1 tag/i)
    ).toBeInTheDocument();
  });

  test("wywołuje onSubmit z poprawnymi danymi", async () => {
    const { onSubmit } = setup();

    await userEvent.type(
      screen.getByPlaceholderText(/wpisz tytuł/i),
      "Mój tytuł"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/opowiedz swoją historię/i),
      "To jest wystarczająco długa treść historii, ponad 20 znaków."
    );

    await userEvent.type(
      screen.getByPlaceholderText(/wpisz nazwę tagu/i),
      "nowyTag"
    );
    await userEvent.click(screen.getByTitle(/dodaj tag/i));

    await userEvent.click(screen.getByRole("button", { name: /opublikuj/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const calls = (onSubmit as jest.Mock).mock.calls as unknown[][];
    const payload = calls[calls.length - 1][0] as StoryCreateFormValues;
    expect(payload).toEqual({
      title: "Mój tytuł",
      content: "To jest wystarczająco długa treść historii, ponad 20 znaków.",
      tags: ["nowyTag"],
      image: undefined,
    });
  });

  test("po dodaniu tagu nie wyświetla błędu tagów podczas wysyłki", async () => {
    setup();

    await userEvent.type(screen.getByPlaceholderText(/wpisz tytuł/i), "ABC");
    await userEvent.type(
      screen.getByPlaceholderText(/opowiedz swoją historię/i),
      "To jest wystarczająco długa treść historii, ponad 20 znaków."
    );

    await userEvent.type(
      screen.getByPlaceholderText(/wpisz nazwę tagu/i),
      "tagX"
    );
    await userEvent.click(screen.getByTitle(/dodaj tag/i));

    await userEvent.click(screen.getByRole("button", { name: /opublikuj/i }));

    await waitFor(() =>
      expect(
        screen.queryByText(/wybierz co najmniej 1 tag/i)
      ).not.toBeInTheDocument()
    );
  });
});
