import React from "react";

export const LogoMarkIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path d="M8 0L16 8L8 16L0 8L8 0Z" fill="currentColor" />
  </svg>
);
