"use client";
import React from "react";
import { IconContainer } from "@/components/atoms/containers/IconContainer";
import { HashIcon } from "@/components/assets/icons/HashIcon";

export interface TrendingTagItem {
  tag: string;
  count: number;
}

interface TrendingSidebarProps {
  title?: string;
  items: TrendingTagItem[];
  className?: string;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  title = "Trendy",
  items,
  className = "",
}) => {
  return (
    <aside
      className={`hidden lg:flex flex-col w-[220px] shrink-0 ${className}`}
    >
      <div className="bg-background-paper rounded-xl overflow-hidden">
        <div className="px-4 py-4 bg-background-paper">
          <h2 className="font-jakarta font-bold text-lg leading-[23px] text-content-primary">
            {title}
          </h2>
        </div>

        <div className="flex flex-col bg-background-paper">
          {items.map((it) => (
            <div
              key={it.tag}
              className="grid grid-cols-[48px_1fr] items-center gap-4 px-4 py-2"
            >
              <IconContainer
                size="md"
                rounded="md"
                className="text-content-primary shrink-0"
              >
                <HashIcon size={20} />
              </IconContainer>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-medium text-content-primary">
                  {it.tag}
                </span>
                <span className="text-sm text-content-secondary break-words">
                  {it.count} historie
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
