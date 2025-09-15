import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { LikeButton, LikeButtonContent } from "./LikeButton";

const meta = {
  title: "Atoms/Buttons/LikeButton",
  component: LikeButton,
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    count: { control: { type: "number", min: 0 } },
  },
} satisfies Meta<typeof LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  args: { active: false, count: 24 },
  render: (args) => (
    <LikeButton {...args}>
      <LikeButtonContent {...args} />
    </LikeButton>
  ),
};

export const Active: Story = {
  args: { active: true, count: 24 },
  render: (args) => (
    <LikeButton {...args}>
      <LikeButtonContent {...args} />
    </LikeButton>
  ),
};

export const ToggleState: Story = {
  name: "Toggle (interactive)",
  render: () => {
    const [active, setActive] = useState(false);
    const [count, setCount] = useState(24);
    return (
      <LikeButton
        active={active}
        count={count}
        onClick={() => {
          setActive((v) => !v);
          setCount((c) => (active ? c - 1 : c + 1));
        }}
      >
        <LikeButtonContent active={active} count={count} />
      </LikeButton>
    );
  },
};
