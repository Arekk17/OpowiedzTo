import React from "react";
import { HeartIcon } from "../../assets/icons/HeartIcon";

interface LikeButtonProps {
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const LikeButton: React.FC<
  React.PropsWithChildren<Omit<LikeButtonProps, "count">>
> = ({ active = false, onClick, className = "", children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-row justify-center items-center h-8 px-2 py-1 gap-2 ${
        active ? "text-accent-error" : "text-content-secondary"
      } ${className}`}
      aria-pressed={active}
      aria-label={active ? "Polubione" : "Polub"}
    >
      {children}
    </button>
  );
};

export const LikeButtonIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <HeartIcon className="w-5 h-5" filled={active} />
);

export const LikeButtonContent: React.FC<LikeButtonProps> = ({
  count = 0,
  active = false,
}) => (
  <>
    <LikeButtonIcon active={active} />
    <span className="font-jakarta font-bold text-[12px] leading-[18px]">
      {count}
    </span>
  </>
);
