import type { Meta, StoryObj } from "@storybook/nextjs";
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

export const Interactive: Story = {
  args: { count: 5 },
  render: (args) => {
    const [count, setCount] = React.useState(args.count || 5);
    return (
      <CommentButton
        {...args}
        count={count}
        onClick={() => {
          setCount((c) => c + 1);
          console.log(`Komentarzy: ${count + 1}`);
        }}
      />
    );
  },
};
