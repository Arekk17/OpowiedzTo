import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StoriesLayout } from "./StoriesLayout";

const meta: Meta<typeof StoriesLayout> = {
  title: "Organisms/Layout/StoriesLayout",
  component: StoriesLayout,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
