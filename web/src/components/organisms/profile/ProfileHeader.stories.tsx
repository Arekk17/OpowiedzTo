import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileHeader } from "./ProfileHeader";

const meta: Meta<typeof ProfileHeader> = {
  title: "Organisms/Profile/ProfileHeader",
  component: ProfileHeader,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
  args: {
    name: "AnonimowyUżytkownik",
    bio: "Kreatywna dusza, która kocha pisać i dzielic się swoimi przemyśleniami.",
    followers: 123,
    following: 456,
    stories: 789,
    avatarSrc:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=256&h=256&fit=crop&crop=face",
  },
};

export const WithoutAvatar: Story = {
  args: {
    name: "AnonimowyUżytkownik",
    bio: "Bez avatara też działa",
    followers: 10,
    following: 5,
    stories: 2,
  },
};
