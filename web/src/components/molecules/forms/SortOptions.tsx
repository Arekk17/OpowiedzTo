"use client";
import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RadioField } from "./RadioField";

// Mapowanie wartości frontend -> backend
export type SortValue = "newest" | "popular" | "most_commented";

const SORT_LABELS: Record<SortValue, string> = {
  newest: "Najnowsze",
  popular: "Najpopularniejsze",
  most_commented: "Najbardziej komentowane",
};

export const SortOptions: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort =
    (searchParams.get("sort") as SortValue | null) ?? "newest";

  const setSort = (value: SortValue) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("sort", value);
    sp.set("page", "1"); // Reset do pierwszej strony przy zmianie sortowania
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {(Object.keys(SORT_LABELS) as SortValue[]).map((value) => (
        <RadioField
          key={value}
          name="sort"
          value={value}
          label={SORT_LABELS[value]}
          checked={currentSort === value}
          onChange={(checked) => checked && setSort(value)}
        />
      ))}
    </div>
  );
};
