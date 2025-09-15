import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { IconContainer } from "./IconContainer";
import { BellIcon } from "../../assets/icons/BellIcon";
import { HashIcon } from "../../assets/icons/HashIcon";

const meta = {
  title: "Atoms/Containers/IconContainer",
  component: IconContainer,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    rounded: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof IconContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <BellIcon size={24} />,
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: <BellIcon size={20} />,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: <BellIcon size={32} />,
    size: "lg",
  },
};

export const RoundedSmall: Story = {
  args: {
    children: <BellIcon size={24} />,
    size: "md",
    rounded: "sm",
  },
};

export const RoundedMedium: Story = {
  args: {
    children: <HashIcon size={24} />,
    size: "md",
    rounded: "md",
  },
};
