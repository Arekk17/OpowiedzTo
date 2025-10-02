import type { Meta, StoryObj } from "@storybook/nextjs";
import { StoriesLayout } from "./StoriesLayout";
import type { StoryListItem } from "./StoriesLayout";

const meta: Meta<typeof StoriesLayout> = {
  title: "Organisms/Layout/StoriesLayout",
  component: StoriesLayout,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stories: [
      {
        id: 1,
        title: "Niespodziewane spotkanie",
        excerpt:
          "Historia o tym, jak przypadkowe spotkanie może zmienić całe życie.",
        author: "Anonim",
        timestamp: "2 godziny temu",
        category: "anonymous",
        isAnonymous: true,
        imageSrc:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        imageAlt: "Niespodziewane spotkanie",
      },
      {
        id: 2,
        title: "Sekretne marzenie",
        excerpt: "Opowieść o ukrytych pragnieniach i odwadze, by je spełnić.",
        author: "Anonim",
        timestamp: "4 godziny temu",
        category: "featured",
        isAnonymous: true,
        imageSrc:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop",
        imageAlt: "Sekretne marzenie",
      },
      {
        id: 3,
        title: "Utracona szansa",
        excerpt: "Refleksja nad momentami, które mogły potoczyć się inaczej.",
        author: "Anonim",
        timestamp: "6 godzin temu",
        category: "trending",
        isAnonymous: true,
      },
      {
        id: 4,
        title: "Powrót do korzeni",
        excerpt: "Historia o powrocie do miejsca, gdzie wszystko się zaczęło.",
        author: "Anonim",
        timestamp: "8 godzin temu",
        category: "new",
        isAnonymous: true,
        imageSrc:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        imageAlt: "Powrót do korzeni",
      },
      {
        id: 5,
        title: "Nowy początek",
        excerpt:
          "Opowieść o przezwyciężaniu przeciwności i rozpoczynaniu od nowa.",
        author: "Anonim",
        timestamp: "10 godzin temu",
        category: "anonymous",
        isAnonymous: true,
        imageSrc:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
        imageAlt: "Nowy początek",
      },
    ] as StoryListItem[],
  },
};
