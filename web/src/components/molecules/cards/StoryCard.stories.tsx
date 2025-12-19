import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { StoryCard } from "./StoryCard";

const meta = {
  title: "Molecules/Cards/StoryCard",
  component: StoryCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: { type: "select" },
      options: ["none", "anonymous", "featured", "trending", "new"],
    },
    isAnonymous: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    excerpt: {
      control: "text",
    },
    author: {
      control: "text",
    },
    createdAt: {
      control: "text",
    },
  },
} satisfies Meta<typeof StoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Anonymous: Story = {
  args: {
    id: "1",
    title: "Tajemnicza historia z dawnych czasów",
    excerpt:
      "To była ciemna noc, gdy zdecydowałam się podzielić tą historią. Nikt nie wie, kim jestem, ale moja historia zasługuje na opowiedzenie...",
    author: "Jan Kowalski",
    createdAt: "2024-01-01T10:00:00Z",
    category: "anonymous",
    isAnonymous: true,
  },
};

export const Featured: Story = {
  args: {
    id: "2",
    title: "Niesamowita przygoda w górach",
    excerpt:
      "Podczas wędrówki w Tatrach natknęliśmy się na coś, czego nigdy nie spodziewaliśmy się zobaczyć. Ta historia zmieni wasze postrzeganie natury...",
    author: "Anna Nowak",
    createdAt: "2024-01-02T10:00:00Z",
    category: "featured",
    isAnonymous: false,
  },
};

export const Trending: Story = {
  args: {
    id: "3",
    title: "Historia, która poruszyła całą społeczność",
    excerpt:
      "Nie spodziewałem się, że ta historia stanie się tak popularna. Dziękuję wszystkim za wsparcie i komentarze...",
    author: "Piotr Wiśniewski",
    createdAt: "2024-01-03T10:00:00Z",
    category: "trending",
    isAnonymous: false,
  },
};

export const New: Story = {
  args: {
    id: "4",
    title: "Świeżo dodana historia o miłości",
    excerpt:
      "Poznałem ją w najbardziej nieoczekiwanym miejscu. Ta historia pokazuje, że miłość może zdarzyć się wszędzie...",
    author: "Maria Kowalczyk",
    createdAt: "2024-01-04T10:00:00Z",
    category: "new",
    isAnonymous: false,
  },
};

export const LongTitle: Story = {
  args: {
    id: "5",
    title:
      "To jest bardzo długi tytuł historii, który ma pokazać jak komponenet radzi sobie z długimi tytułami i czy odpowiednio je obcina",
    excerpt: "Krótki opis",
    author: "Test User",
    createdAt: "2024-01-05T10:00:00Z",
    category: "anonymous",
    isAnonymous: true,
  },
};

export const LongExcerpt: Story = {
  args: {
    id: "6",
    title: "Historia z długim opisem",
    excerpt:
      "To jest bardzo długi opis historii, który ma sprawdzić jak komponenet radzi sobie z długimi opisami i czy odpowiednio je obcina. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Test User",
    createdAt: "2024-01-06T10:00:00Z",
    category: "featured",
    isAnonymous: false,
  },
};

export const WithoutBadge: Story = {
  name: "Bez odznaki",
  args: {
    id: "7",
    title: "Niespodziewane spotkanie",
    excerpt:
      "Historia o tym, jak przypadkowe spotkanie może zmienić całe życie.",
    author: "Ktoś",
    createdAt: "2024-01-07T10:00:00Z",
    category: "none",
    isAnonymous: false,
  },
};

export const WithImage: Story = {
  name: "Z obrazkiem (Unsplash)",
  args: {
    id: "8",
    title: "Niespodziewane spotkanie",
    excerpt:
      "Historia o tym, jak przypadkowe spotkanie może zmienić całe życie.",
    author: "Ktoś",
    createdAt: "2024-01-08T10:00:00Z",
    category: "none",
    isAnonymous: false,
    imageSrc:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Scena z miasta",
  },
};

export const Interactive: Story = {
  args: {
    id: "9",
    title: "Kliknij mnie!",
    excerpt: "Ta karta reaguje na kliknięcia i pokazuje interaktywne funkcje.",
    author: "Interaktywny Bot",
    createdAt: new Date().toISOString(),
    category: "featured",
    isAnonymous: false,
  },
  render: () => {
    const [clicked, setClicked] = React.useState(false);
    const [likes, setLikes] = React.useState(42);
    const [comments, setComments] = React.useState(8);

    return (
      <div className="space-y-4 w-full max-w-md">
        <div onClick={() => setClicked(!clicked)}>
          <StoryCard
            id="9"
            title={clicked ? "Kliknięta historia!" : "Kliknij mnie!"}
            excerpt="Ta karta reaguje na kliknięcia i pokazuje interaktywne funkcje."
            author="Interaktywny Bot"
            createdAt={new Date().toISOString()}
            category="featured"
            isAnonymous={false}
          />
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setLikes((l) => l + 1)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
          >
            ❤️ +1 ({likes})
          </button>
          <button
            onClick={() => setComments((c) => c + 1)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
          >
            💬 +1 ({comments})
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Status: {clicked ? "Aktywna" : "Nieaktywna"} | ❤️ {likes} | 💬{" "}
          {comments}
        </div>
      </div>
    );
  },
};
