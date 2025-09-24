import type { Meta, StoryObj } from "@storybook/nextjs";
import { Comment } from "./Comment";

const meta: Meta<typeof Comment> = {
  title: "Molecules/Comments/Comment",
  component: Comment,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    author: {
      control: "text",
    },
    content: {
      control: "text",
    },
    timestamp: {
      control: "text",
    },
    avatarSrc: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Comment>;

export const Default: Story = {
  args: {
    id: "1",
    author: "Anonimowy",
    content: "Piękna historia, wzruszyłam się!",
    timestamp: "14 maja 2024",
  },
};

export const WithAvatar: Story = {
  args: {
    id: "2",
    author: "Anna Kowalska",
    content: "Ciekawe, czy kiedyś się odnajdziecie.",
    timestamp: "15 maja 2024",
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108755-2616b612b167?w=80&h=80&fit=crop&crop=face",
  },
};

export const LongComment: Story = {
  args: {
    id: "3",
    author: "Jan Nowak",
    content:
      "To brzmi jak początek filmu! Naprawdę fascynujące, jak los potrafi łączyć ludzi w najmniej oczekiwanych momentach. Mam nadzieję, że kiedyś się spotkają ponownie.",
    timestamp: "16 maja 2024",
  },
};
