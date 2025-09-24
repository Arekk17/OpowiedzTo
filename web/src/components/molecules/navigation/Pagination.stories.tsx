import type { Meta, StoryObj } from "@storybook/nextjs";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    totalPages: {
      control: { type: "number", min: 1, max: 20 },
      description: "Calkowita liczba stron",
    },
    currentPage: {
      control: { type: "number", min: 1, max: 20 },
      description: "Aktualna strona (1-based)",
    },
    disabled: {
      control: "boolean",
      description: "Czy przyciski sa wyłączone",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalPages: 5,
    currentPage: 3,
    disabled: false,
  },
};

export const FirstPage: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
    disabled: false,
  },
};

export const LastPage: Story = {
  args: {
    totalPages: 5,
    currentPage: 5,
    disabled: false,
  },
};

export const SinglePage: Story = {
  args: {
    totalPages: 1,
    currentPage: 1,
    disabled: false,
  },
};

export const ManyPages: Story = {
  args: {
    totalPages: 10,
    currentPage: 5,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    totalPages: 5,
    currentPage: 3,
    disabled: true,
  },
};
