import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import Header from "./Header";

const LoggedOutActions: React.FC = () => (
  <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
    <button className="text-content-primary font-jakarta font-medium text-sm leading-[21px]">
      Zaloguj się
    </button>
    <button className="bg-primary text-content-inverse px-4 py-2 rounded-md font-jakarta font-medium text-sm">
      Zarejestruj się
    </button>
  </div>
);

const LoggedInActions: React.FC = () => (
  <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
    <div className="w-10 h-10 rounded-full bg-ui-border" />
    <div className="w-10 h-10 rounded-full bg-ui-border" />
  </div>
);

const meta: Meta<typeof Header> = {
  title: "Organisms/Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  name: "User Logged Out",
  render: () => <Header UserActionsComponent={LoggedOutActions} />,
  parameters: {
    docs: {
      description: {
        story:
          "Header state when user is not authenticated. Shows login and register buttons.",
      },
    },
  },
};

export const LoggedIn: Story = {
  name: "User Logged In",
  render: () => <Header UserActionsComponent={LoggedInActions} />,
  parameters: {
    docs: {
      description: {
        story:
          "Header state when user is authenticated. Shows notification icon and profile avatar.",
      },
    },
  },
};
