import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { ImageUpload } from "./ImageUpload";

const meta: Meta<typeof ImageUpload> = {
  title: "Molecules/Upload/ImageUpload",
  component: ImageUpload,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Interactive: Story = {
  render: () => {
    const [file, setFile] = React.useState<File | string | undefined>();
    return <ImageUpload file={file as any} onChange={setFile as any} />;
  },
};
