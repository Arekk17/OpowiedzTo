import React from "react";

export interface ProfileCountersProps {
  followers: number;
  following: number;
  stories: number;
  className?: string;
}

export const ProfileCounters: React.FC<ProfileCountersProps> = ({
  followers,
  following,
  stories,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row items-center justify-center gap-2 text-content-secondary font-jakarta text-base leading-6 ${className}`}
      aria-label="Statystyki profilu"
    >
      <span>{followers} obserwujących</span>
      <span className="px-1">·</span>
      <span>{following} obserwowanych</span>
      <span className="px-1">·</span>
      <span>{stories} historii</span>
    </div>
  );
};
