import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileAvatar } from "./ProfileAvatar";

const meta = {
  title: "Atoms/Icons/ProfileAvatar",
  component: ProfileAvatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    src: {
      control: "text",
    },
    alt: {
      control: "text",
    },
  },
} satisfies Meta<typeof ProfileAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "md",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    alt: "John Doe",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const SmallWithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    alt: "Jane Smith",
    size: "sm",
  },
};

export const LargeWithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    alt: "Alex Johnson",
    size: "lg",
  },
};
