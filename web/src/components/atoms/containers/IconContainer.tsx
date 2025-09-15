import React from "react";

interface IconContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md";
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  className = "",
  size = "md",
  rounded = "md",
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-16 h-16";
      default:
        return "w-12 h-12";
    }
  };

  const getRoundedStyles = () => {
    switch (rounded) {
      case "sm":
        return "rounded-lg";
      case "md":
        return "rounded-[20px]";
      default:
        return "rounded-lg";
    }
  };

  return (
    <div
      className={`
          flex items-center justify-center
          ${getSizeStyles()}
          bg-ui-notification
          ${getRoundedStyles()}
          ${className}
        `}
    >
      <div className="w-6 h-6 flex items-center justify-center">{children}</div>
    </div>
  );
};
