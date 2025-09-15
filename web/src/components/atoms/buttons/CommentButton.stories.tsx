import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { CommentButton } from "./CommentButton";

const meta = {
  title: "Atoms/Buttons/CommentButton",
  component: CommentButton,
  tags: ["autodocs"],
  argTypes: {
    count: { control: { type: "number", min: 0 } },
  },
} satisfies Meta<typeof CommentButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 12 },
};
