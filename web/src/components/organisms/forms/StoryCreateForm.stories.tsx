import type { Meta, StoryObj } from "@storybook/nextjs";
import { StoryCreateForm } from "./StoryCreateForm";

const meta: Meta<typeof StoryCreateForm> = {
  title: "Organisms/Forms/StoryCreateForm",
  component: StoryCreateForm,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StoryCreateForm>;

const options = [
  "Miłość",
  "Zdrada",
  "Przygoda",
  "Rodzina",
  "Inne",
  "Studia",
  "Sekret",
];

export const Default: Story = {
  args: {
    options,
    onSubmit: async (data) => {
      alert(`Zapisano!\n${JSON.stringify(data, null, 2)}`);
    },
  },
};
