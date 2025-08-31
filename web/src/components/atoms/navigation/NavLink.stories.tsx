import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavLink } from "./NavLink";

const meta = {
  title: "Atoms/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  argTypes: {
    href: {
      control: "text",
    },
    children: {
      control: "text",
    },
    className: {
      control: "text",
    },
  },
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/dashboard",
    children: "Dashboard",
  },
};

export const Active: Story = {
  args: {
    href: "/posts",
    children: "Posty",
    className: "text-primary-accent",
  },
};

export const WithCustomClass: Story = {
  args: {
    href: "/profile",
    children: "Profil",
    className: "font-bold",
  },
};
