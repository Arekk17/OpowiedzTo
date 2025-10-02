import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { ProfileSubnav } from "./ProfileSubnav";

const meta: Meta<typeof ProfileSubnav> = {
  title: "Molecules/Navigation/ProfileSubnav",
  component: ProfileSubnav,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProfileSubnav>;

const items = [
  { key: "stories", label: "Historie" },
  { key: "comments", label: "Komentarze" },
  { key: "likes", label: "Polubione" },
];

export const Default: Story = {
  args: {
    items,
    activeKey: "stories",
  },
};

export const CommentsActive: Story = {
  args: {
    items,
    activeKey: "comments",
  },
};

export const LikesActive: Story = {
  args: {
    items,
    activeKey: "likes",
  },
};

export const Interactive: Story = {
  args: {
    items,
    activeKey: "stories",
  },
  render: (args) => {
    const [active, setActive] = React.useState(args.activeKey);
    return (
      <ProfileSubnav
        {...args}
        activeKey={active}
        onChange={(key) => setActive(key)}
      />
    );
  },
};
