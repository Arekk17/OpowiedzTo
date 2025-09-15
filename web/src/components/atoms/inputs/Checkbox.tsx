import React from "react";

interface CheckboxProps {
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  value,
  checked,
  defaultChecked,
  disabled,
  onChange,
  label,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <label
      className={`inline-flex items-center gap-3 ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className={`border-gray-300 rounded h-5 w-5 ${sizeClasses[size]}`}
        />
      </div>
      {label && (
        <span className="text-sm font-jakarta text-content-primary select-none">
          {label}
        </span>
      )}
    </label>
  );
};
