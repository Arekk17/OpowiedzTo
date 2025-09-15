import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Radio } from "./Radio";

const meta = {
  title: "Atoms/Inputs/Radio",
  component: Radio,
  tags: ["autodocs"],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    label: "Opcja",
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Opcja",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Opcja (wyłączona)",
    disabled: true,
    defaultChecked: false,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Radio
        label={checked ? "Zaznaczone" : "Niezaznaczone"}
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};
