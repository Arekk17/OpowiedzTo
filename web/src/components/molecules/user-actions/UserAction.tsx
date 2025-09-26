"use client";
import React from "react";
import { IconButton } from "../../atoms/buttons/IconButton";
import { IconContainer } from "../../atoms/containers/IconContainer";
import { BellIcon } from "../../assets/icons/BellIcon";
import { ProfileAvatar } from "../../atoms/icons/ProfileAvatar";
import { useAuth } from "../../../hooks/useAuth";
import Link from "next/link";

export const UserActions: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
        <Link
          href="/auth/login"
          className="text-content-primary font-jakarta font-medium text-sm leading-[21px] hover:text-primary-accent transition-colors"
        >
          Zaloguj się
        </Link>
        <Link
          href="/auth/register"
          className="bg-primary text-content-inverse px-4 py-2 rounded-md hover:bg-primary-light font-jakarta font-medium text-sm transition-colors"
        >
          Zarejestruj się
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
      <IconButton variant="notification">
        <IconContainer>
          <BellIcon />
        </IconContainer>
      </IconButton>
      <IconButton variant="profile">
        <ProfileAvatar src={undefined} alt={user?.nickname} />
      </IconButton>
    </div>
  );
};
