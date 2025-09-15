import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Tag } from "./Tag";

const meta = {
  title: "Atoms/Tags/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Miłość",
  },
};
