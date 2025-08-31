import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotificationIcon } from "./NotificationIcon";

const meta = {
  title: "Atoms/NotificationIcon",
  component: NotificationIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const InButton: Story = {
  decorators: [
    (Story) => (
      <button className="p-2 bg-ui-notification rounded-full hover:bg-ui-hover transition-colors">
        <Story />
      </button>
    ),
  ],
};
