import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Input } from "./Input";
import { SearchIcon } from "../../assets/icons/SearchIcon";

const meta: Meta<typeof Input> = {
  title: "Atoms/Inputs/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    disabled: { control: { type: "boolean" } },
    loading: { control: { type: "boolean" } },
    fullWidth: { control: { type: "boolean" } },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "date", "number", "search"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Wpisz tekst...",
  },
};

export const WithLabel: Story = {
  args: {
    placeholder: "Email",
    showLabel: true,
    label: "Email",
    fullWidth: false,
  },
};

export const WithIcons: Story = {
  args: {
    placeholder: "Szukaj...",
    leftIcon: <SearchIcon className="w-5 h-5" />,
    rightIcon: <span className="text-content-secondary text-sm">⌘K</span>,
    fullWidth: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-[320px]">
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Email"
          showLabel
          label="Email"
          // symulacja błędu z RHF: przekazujemy obiekt z message
          error={{ type: "manual", message: "Niepoprawny email" } as any}
          fullWidth
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    placeholder: "Ładowanie...",
    loading: true,
    fullWidth: true,
  },
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[360px]">
      <Input type="text" placeholder="Tekst" fullWidth />
      <Input type="email" placeholder="Email" fullWidth />
      <Input type="password" placeholder="Hasło" fullWidth />
      <Input type="date" placeholder="Data" fullWidth />
      <Input type="number" placeholder="Liczba" fullWidth />
    </div>
  ),
};
