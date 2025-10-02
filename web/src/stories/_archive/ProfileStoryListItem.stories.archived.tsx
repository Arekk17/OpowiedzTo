import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileStoryListItem } from "./ProfileStoryListItem";

const meta: Meta<typeof ProfileStoryListItem> = {
  title: "Molecules/Profile/ProfileStoryListItem",
  component: ProfileStoryListItem,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProfileStoryListItem>;

export const WithImage: Story = {
  args: {
    tagsText: "Tagi: #zycie #przemyslenia",
    title: "Moja historia",
    excerpt:
      "To jest moja historia, w której dzielę się swoimi przemyśleniami...",
    imageSrc:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=640&h=400&fit=crop",
  },
};

export const WithoutImage: Story = {
  args: {
    tagsText: "Tagi: #podroze #wspomnienia",
    title: "Wspomnienia z podróży",
    excerpt: "Opisuję moje niezapomniane przygody i wspomnienia z podróży...",
  },
};
