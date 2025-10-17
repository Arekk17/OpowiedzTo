"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const UnauthenticatedActions: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
      <Link
        href={`/auth/login?callbackUrl=${encodeURIComponent(
          pathname || "/dashboard/profile",
        )}`}
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
};
