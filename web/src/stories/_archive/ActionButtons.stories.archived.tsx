import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { ActionButtons } from "./ActionButtons";

const meta: Meta<typeof ActionButtons> = {
  title: "Molecules/Actions/ActionButtons",
  component: ActionButtons,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const Default: Story = {
  args: {
    onReport: () => console.log("Zgłoszono"),
    onSave: () => console.log("Zapisano"),
  },
};

export const Interactive: Story = {
  render: () => {
    const [reported, setReported] = React.useState(false);
    const [saved, setSaved] = React.useState(false);

    return (
      <div className="space-y-4">
        <ActionButtons
          onReport={() => {
            setReported(true);
            alert("Historia została zgłoszona!");
          }}
          onSave={() => {
            setSaved(!saved);
            alert(saved ? "Usunięto z zapisanych" : "Zapisano historię!");
          }}
        />
        <div className="text-sm text-center">
          Status: {reported ? "Zgłoszona" : "Nie zgłoszona"} |{" "}
          {saved ? "Zapisana" : "Nie zapisana"}
        </div>
      </div>
    );
  },
};
