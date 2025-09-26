import React from "react";
import { HeartIcon } from "../../assets/icons/HeartIcon";

interface LikeButtonProps {
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LikeButton: React.FC<
  React.PropsWithChildren<Omit<LikeButtonProps, "count">>
> = ({
  active = false,
  onClick,
  className = "",
  children,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`flex flex-row justify-center items-center h-8 px-2 py-1 gap-2 ${
        active ? "text-accent-error" : "text-content-secondary"
      } ${className}`}
      aria-pressed={active}
      aria-label={active ? "Polubione" : "Polub"}
      disabled={disabled}
      aria-disabled={disabled}
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
