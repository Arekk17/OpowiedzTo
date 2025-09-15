import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { RadioField } from "./RadioField";

const meta = {
  title: "Molecules/Forms/RadioField",
  component: RadioField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof RadioField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Najnowsze",
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Najnowsze",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Najnowsze (wyłączone)",
    disabled: true,
    defaultChecked: false,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <RadioField
        label={checked ? "Zaznaczone" : "Niezaznaczone"}
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState("newest");
    return (
      <div className="space-y-2">
        <RadioField
          name="sort"
          value="newest"
          label="Najnowsze"
          checked={selected === "newest"}
          onChange={() => setSelected("newest")}
        />
        <RadioField
          name="sort"
          value="popular"
          label="Najpopularniejsze"
          checked={selected === "popular"}
          onChange={() => setSelected("popular")}
        />
        <RadioField
          name="sort"
          value="trending"
          label="Trending"
          checked={selected === "trending"}
          onChange={() => setSelected("trending")}
        />
      </div>
    );
  },
};
