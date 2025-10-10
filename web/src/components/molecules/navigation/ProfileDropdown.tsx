"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ProfileAvatar } from "../../atoms/icons/ProfileAvatar";
import { useAuth } from "../../../hooks/useAuth";
import type { User } from "@/types/user";

interface ProfileDropdownProps {
  user: User;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user: initialUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signout } = useAuth();

  // Użyj user z hooka jeśli dostępny, inaczej initialUser
  const currentUser = user || initialUser;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    signout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="Menu użytkownika"
      >
        <ProfileAvatar src={currentUser?.avatar} alt={currentUser?.nickname} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background-paper border border-ui-border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="py-2 px-4 border-b border-ui-border">
            <p className="text-sm font-medium text-content-primary truncate">
              {currentUser?.nickname}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-content-primary hover:bg-background-default hover:text-primary-accent font-jakarta font-medium text-sm leading-[21px] transition-colors"
            >
              Profil
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-content-primary hover:bg-background-default hover:text-primary-accent font-jakarta font-medium text-sm leading-[21px] transition-colors"
            >
              Ustawienia
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-content-primary hover:bg-background-default hover:text-primary-accent font-jakarta font-medium text-sm leading-[21px] transition-colors"
            >
              Wyloguj się
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
