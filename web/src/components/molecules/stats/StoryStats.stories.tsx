import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { StoryStats } from "./StoryStats";

const meta: Meta<typeof StoryStats> = {
  title: "Molecules/Stats/StoryStats",
  component: StoryStats,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    likes: {
      control: { type: "number", min: 0 },
    },
    comments: {
      control: { type: "number", min: 0 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StoryStats>;

export const Default: Story = {
  args: {
    likes: 123,
    comments: 45,
  },
};

export const HighNumbers: Story = {
  args: {
    likes: 1234,
    comments: 567,
  },
};

export const LowNumbers: Story = {
  args: {
    likes: 5,
    comments: 2,
  },
};

export const NoActivity: Story = {
  args: {
    likes: 0,
    comments: 0,
  },
};

export const Interactive: Story = {
  render: () => {
    const [likes, setLikes] = React.useState(10);
    const [liked, setLiked] = React.useState(false);
    return (
      <StoryStats
        likes={likes}
        comments={4}
        liked={liked}
        onToggleLike={(next) => {
          setLiked(next);
          setLikes((l) => (next ? l + 1 : Math.max(0, l - 1)));
        }}
      />
    );
  },
};
