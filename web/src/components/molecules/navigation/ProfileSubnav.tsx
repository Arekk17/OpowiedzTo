import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

export type ProfileSubnavItem = {
  key: string;
  label: string;
  href?: string;
};

type ProfileSubnavProps = {
  items: ProfileSubnavItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  className?: string;
};

export const ProfileSubnav: React.FC<ProfileSubnavProps> = ({
  items,
  activeKey,
  onChange,
  className,
}) => {
  return (
    <nav
      className={clsx(
        "box-border flex flex-row items-start gap-8 px-4 w-full max-w-[960px] h-[54px] border-b border-ui-border",
        className
      )}
      aria-label="Nawigacja profilu"
      role="tablist"
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const baseClasses = clsx(
          "box-border flex flex-col justify-center items-center",
          "pt-4 pb-[13px] h-[53px]",
          "-mb-[2px]",
          "border-b-[3px] border-transparent",
          "min-w-[54px]",
          !isActive && "hover:text-content-primary/80"
        );

        const labelClasses = clsx(
          "font-jakarta font-bold text-sm leading-[21px]",
          isActive ? "text-content-primary" : "text-content-secondary"
        );

        const content = (
          <span className={labelClasses} role="tab" aria-selected={isActive}>
            {item.label}
          </span>
        );

        const contentWithUnderline = (
          <div
            className={clsx(
              baseClasses,
              isActive && "border-b-[3px] border-content-primary"
            )}
          >
            {content}
          </div>
        );

        if (item.href) {
          return (
            <Link key={item.key} href={item.href}>
              {contentWithUnderline}
            </Link>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            className="p-0"
            onClick={() => onChange?.(item.key)}
          >
            {contentWithUnderline}
          </button>
        );
      })}
    </nav>
  );
};
