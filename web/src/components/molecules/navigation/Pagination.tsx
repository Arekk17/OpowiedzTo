"use client";

import React from "react";
import { clsx } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  className?: string;
  disabled?: boolean;
};

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  className,
  disabled = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (totalPages <= 0) return null;

  const pushPage = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage)
      return;
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav
      className={clsx("w-full flex justify-center items-center p-4", className)}
      aria-label="Paginacja"
    >
      <div className="flex flex-row gap-2">
        <button
          type="button"
          className={clsx(
            "flex flex-row justify-center items-center p-0 w-10 h-10 rounded-lg transition-colors text-content-secondary hover:bg-ui-hover",
            (isFirst || disabled) && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => pushPage(currentPage - 1)}
          disabled={isFirst || disabled}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={clsx(
              "flex flex-row justify-center items-center p-0 w-10 h-10 rounded-lg transition-colors text-content-secondary hover:bg-ui-hover",
              page === currentPage && "bg-ui-notification text-content-primary"
            )}
            onClick={() => pushPage(page)}
            disabled={disabled}
          >
            <span className="font-jakarta text-sm leading-[21px]">{page}</span>
          </button>
        ))}
        <button
          type="button"
          className={clsx(
            "flex flex-row justify-center items-center p-0 w-10 h-10 rounded-lg transition-colors text-content-secondary hover:bg-ui-hover",
            (isLast || disabled) && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => pushPage(currentPage + 1)}
          disabled={isLast || disabled}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};
