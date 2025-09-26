"use client";
import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RadioField } from "./RadioField";

export type SortValue = "new" | "popular" | "most_commented";

export const SortOptions: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as SortValue | null) ?? "new";

  const setSort = (value: SortValue) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("sort", value);
    sp.set("page", "1");
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <RadioField
        name="sort"
        value="new"
        label="Najnowsze"
        checked={currentSort === "new"}
        onChange={(checked) => checked && setSort("new")}
      />
      <RadioField
        name="sort"
        value="popular"
        label="Najpopularniejsze"
        checked={currentSort === "popular"}
        onChange={(checked) => checked && setSort("popular")}
      />
      <RadioField
        name="sort"
        value="most_commented"
        label="Najbardziej komentowane"
        checked={currentSort === "most_commented"}
        onChange={(checked) => checked && setSort("most_commented")}
      />
    </div>
  );
};
