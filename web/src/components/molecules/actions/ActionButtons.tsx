import React from "react";
import { FlagIcon, BookmarkIcon } from "@heroicons/react/24/outline";

export interface ActionButtonsProps {
  onReport?: () => void;
  onSave?: () => void;
  className?: string;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center p-[10px] gap-2 w-20 h-[89px] bg-background-subtle"
  >
    <div className="flex flex-col items-center justify-center p-[10px] w-10 h-10 bg-ui-notification rounded-[20px]">
      <div className="w-5 h-5 text-content-primary">{icon}</div>
    </div>
    <span className="font-jakarta font-medium text-sm leading-[21px] text-center text-content-primary">
      {label}
    </span>
  </button>
);

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onReport,
  onSave,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row flex-wrap items-start p-0 px-4 gap-2 w-full ${className}`}
    >
      <ActionButton
        icon={<FlagIcon className="w-5 h-5" />}
        label="Zgłoś"
        onClick={onReport}
      />
      <ActionButton
        icon={<BookmarkIcon className="w-5 h-5" />}
        label="Zapisz"
        onClick={onSave}
      />
    </div>
  );
};
