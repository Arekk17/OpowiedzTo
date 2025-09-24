import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { StoryDetailLayout } from "./StoryDetailLayout";

const meta: Meta<typeof StoryDetailLayout> = {
  title: "Templates/StoryDetailLayout",
  component: StoryDetailLayout,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof StoryDetailLayout>;

const mockData = {
  story: {
    title: "Sekretne spotkanie",
    content:
      "To wydarzyło się kilka lat temu, kiedy byłam na studiach. Poznałam Michała na imprezie u znajomych. Od razu poczuliśmy do siebie miętę, ale oboje byliśmy w związkach. Zaczęliśmy pisać do siebie anonimowo, dzieląc się sekretami i marzeniami. Po kilku tygodniach postanowiliśmy się spotkać, nie mówiąc sobie, kim jesteśmy. Spotkanie było magiczne, ale po nim oboje zdecydowaliśmy, że to koniec. Do dziś nie wiem, kim był Michał, ale zawsze będę pamiętać to spotkanie.",
    tags: ["Sekret", "Miłość", "Studia"],
    publishedDate: "15 maja 2024",
    author: "Anonimowy",
    imageSrc:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=928&h=218&fit=crop",
    imageAlt: "Romantyczne spotkanie",
  },
  stats: {
    likes: 123,
    comments: 45,
  },
  comments: {
    comments: [
      {
        id: "1",
        author: "Anonimowy",
        content: "Piękna historia, wzruszyłam się!",
        timestamp: "14 maja 2024",
      },
      {
        id: "2",
        author: "Anonimowy",
        content: "Ciekawe, czy kiedyś się odnajdziecie.",
        timestamp: "15 maja 2024",
      },
      {
        id: "3",
        author: "Anonimowy",
        content: "To brzmi jak początek filmu!",
        timestamp: "16 maja 2024",
      },
    ],
  },
  actions: {
    onReport: () => console.log("Zgłoszono"),
    onSave: () => console.log("Zapisano"),
  },
};

export const Default: Story = {
  args: mockData,
};

export const WithoutImage: Story = {
  args: {
    ...mockData,
    story: {
      ...mockData.story,
      imageSrc: undefined,
      imageAlt: undefined,
    },
  },
};

export const NoComments: Story = {
  args: {
    ...mockData,
    comments: {
      comments: [],
      title: "Brak komentarzy",
    },
    stats: {
      likes: 50,
      comments: 0,
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [likes, setLikes] = React.useState(123);
    const [comments, setComments] = React.useState(mockData.comments.comments);
    const [saved, setSaved] = React.useState(false);
    const [reported, setReported] = React.useState(false);

    const addComment = () => {
      const newComment = {
        id: String(comments.length + 1),
        author: "Nowy Użytkownik",
        content: "To jest nowy komentarz dodany interaktywnie!",
        timestamp: new Date().toLocaleDateString("pl-PL"),
      };
      setComments([...comments, newComment]);
    };

    return (
      <div className="space-y-4">
        <StoryDetailLayout
          story={mockData.story}
          stats={{ likes, comments: comments.length }}
          comments={{ comments }}
          actions={{
            onReport: () => {
              setReported(true);
              alert("Historia została zgłoszona!");
            },
            onSave: () => {
              setSaved(!saved);
              alert(saved ? "Usunięto z zapisanych" : "Zapisano historię!");
            },
          }}
        />
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={() => setLikes((l) => l + 1)}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            +1 Polubienie
          </button>
          <button
            onClick={addComment}
            className="px-4 py-2 bg-accent-primary text-white rounded"
          >
            Dodaj komentarz
          </button>
        </div>
        <div className="text-center text-sm">
          Status: {saved ? "Zapisana" : "Nie zapisana"} |{" "}
          {reported ? "Zgłoszona" : "Nie zgłoszona"}
        </div>
      </div>
    );
  },
};
