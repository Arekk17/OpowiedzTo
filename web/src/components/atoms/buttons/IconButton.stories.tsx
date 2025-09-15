import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BellIcon, UserIcon } from "@heroicons/react/24/outline";
import { IconButton } from "./IconButton";

const meta = {
  title: "Atoms/Buttons/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["notification", "profile"],
    },
    className: {
      control: "text",
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Notification: Story = {
  args: {
    variant: "notification",
    children: <BellIcon className="w-5 h-5" />,
  },
};

export const Profile: Story = {
  args: {
    variant: "profile",
    children: <UserIcon className="w-5 h-5" />,
  },
};

export const WithCustomClass: Story = {
  args: {
    variant: "notification",
    children: <BellIcon className="w-5 h-5" />,
    className: "border border-ui-border",
  },
};
