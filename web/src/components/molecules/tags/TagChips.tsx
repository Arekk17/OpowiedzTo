import React from "react";
import { Tag } from "@/types/tags";
import Link from "next/link";

type TagChipsProps = {
  tags: Tag[];
  activeTag: string | undefined;
  makeHref: (tag: string | undefined) => string;
  className?: string;
};

const TagChips = ({ tags, activeTag, makeHref, className }: TagChipsProps) => {
  return (
    <div
      className={`flex flex-row flex-wrap gap-2${
        className ? ` ${className}` : ""
      }`}
    >
      {tags.map((t) => (
        <Link
          key={t.id}
          href={makeHref(t.slug)}
          className={`inline-flex items-center justify-center h-8 px-4 rounded-full bg-ui-notification text-content-primary font-jakarta text-[14px] leading-[21px] ${
            t.slug === activeTag ? "ring-2 ring-accent-primary" : ""
          }`}
        >
          {t.name}
        </Link>
      ))}
      {activeTag && (
        <Link
          href={makeHref("")}
          aria-label="Wyczyść filtr tagów"
          className="inline-flex items-center justify-center h-8 px-3 rounded-full border border-ui-border bg-transparent text-content-secondary hover:text-content-primary hover:bg-background-paper transition-colors font-jakarta text-[14px] leading-[21px]"
        >
          ✕ Wyczyść
        </Link>
      )}
    </div>
  );
};

export default TagChips;
