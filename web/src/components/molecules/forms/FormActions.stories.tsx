import type { Meta, StoryObj } from "@storybook/nextjs";
import { FormActions } from "./FormActions";

const meta: Meta<typeof FormActions> = {
  title: "Molecules/Forms/FormActions",
  component: FormActions,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FormActions>;

export const Default: Story = {
  args: {
    onPublish: () => alert("Publikacja!"),
    onPreview: () => alert("Podgląd!"),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    onPublish: () => {},
    onPreview: () => {},
  },
};
