import React from "react";
import { CommentIcon } from "../../assets/icons/CommentIcon";

interface CommentButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export const CommentButton: React.FC<CommentButtonProps> = ({
  count = 0,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-row justify-center items-center h-8 px-2 py-1 gap-2 text-content-secondary ${className}`}
      aria-label="Komentarze"
    >
      <CommentIcon className="w-5 h-5" />
      <span className="font-jakarta font-bold text-[12px] leading-[18px]">
        {count}
      </span>
    </button>
  );
};
