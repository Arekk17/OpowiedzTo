import type { Meta, StoryObj } from "@storybook/nextjs";
import { CommentList } from "./CommentList";

const meta: Meta<typeof CommentList> = {
  title: "Organisms/Comments/CommentList",
  component: CommentList,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CommentList>;

const mockComments = [
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
];

export const Default: Story = {
  args: {
    comments: mockComments,
  },
};

export const Empty: Story = {
  args: {
    comments: [],
    title: "Brak komentarzy",
  },
};

export const SingleComment: Story = {
  args: {
    comments: [mockComments[0]],
  },
};
