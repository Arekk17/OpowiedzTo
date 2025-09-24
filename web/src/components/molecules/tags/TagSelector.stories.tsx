import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { TagSelector } from "./TagSelector";

const meta: Meta<typeof TagSelector> = {
  title: "Molecules/Tags/TagSelector",
  component: TagSelector,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TagSelector>;

const opts = [
  "Miłość",
  "Zdrada",
  "Przygoda",
  "Rodzina",
  "Inne",
  "Studia",
  "Sekret",
];

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["Miłość"]);
    return (
      <TagSelector options={opts} value={value} onChange={setValue} max={5} />
    );
  },
};
