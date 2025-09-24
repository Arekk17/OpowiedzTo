import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { BellIcon, UserIcon } from "@heroicons/react/24/outline";
import { IconButton } from "./IconButton";

const meta = {
  title: "Atoms/Buttons/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["notification", "profile"],
    },
    className: {
      control: "text",
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Notification: Story = {
  args: {
    variant: "notification",
    children: <BellIcon className="w-5 h-5" />,
  },
};

export const Profile: Story = {
  args: {
    variant: "profile",
    children: <UserIcon className="w-5 h-5" />,
  },
};

export const WithCustomClass: Story = {
  args: {
    variant: "notification",
    children: <BellIcon className="w-5 h-5" />,
    className: "border border-ui-border",
  },
};

export const Interactive: Story = {
  render: () => {
    const [notifications, setNotifications] = React.useState(3);
    const [profileClicked, setProfileClicked] = React.useState(false);

    return (
      <div className="flex gap-4 items-center">
        <div className="relative">
          <IconButton
            variant="notification"
            onClick={() => {
              setNotifications(0);
              alert("Powiadomienia przeczytane!");
            }}
          >
            <BellIcon className="w-5 h-5" />
          </IconButton>
          {notifications > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </div>
          )}
        </div>

        <IconButton
          variant="profile"
          onClick={() => {
            setProfileClicked(!profileClicked);
            alert(profileClicked ? "Profil zamknięty" : "Profil otwarty");
          }}
        >
          <UserIcon className="w-5 h-5" />
        </IconButton>

        <div className="text-sm">
          Powiadomienia: {notifications} | Profil:{" "}
          {profileClicked ? "Aktywny" : "Nieaktywny"}
        </div>
      </div>
    );
  },
};
