"use client";
import React from "react";
import { IconButton } from "../../atoms/buttons/IconButton";
import { BellIcon } from "../../assets/icons/BellIcon";
import { ProfileDropdown } from "../navigation/ProfileDropdown";
import type { User } from "@/types/user";

interface AuthenticatedActionsProps {
  user: User;
}

export const AuthenticatedActions: React.FC<AuthenticatedActionsProps> = ({
  user,
}) => {
  return (
    <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
      <IconButton variant="notification">
        <BellIcon />
      </IconButton>
      <ProfileDropdown user={user} />
    </div>
  );
};
