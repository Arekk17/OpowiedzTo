import React from "react";

export const BellIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M10 2C7.5 2 5.5 4 5.5 6.5V10L3 12.5V14H17V12.5L14.5 10V6.5C14.5 4 12.5 2 10 2ZM10 18C11.1 18 12 17.1 12 16H8C8 17.1 8.9 18 10 18Z"
      fill="currentColor"
    />
  </svg>
);
