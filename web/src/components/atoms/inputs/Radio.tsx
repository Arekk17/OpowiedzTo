import React from "react";

interface RadioProps {
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked,
  defaultChecked,
  disabled,
  onChange,
  label,
  className = "",
}) => {
  return (
    <label
      className={`inline-flex items-center gap-2 ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className={`
          appearance-none relative w-5 h-5 rounded-full border-2 transition-colors duration-150
          border-ui-border checked:border-accent-primary
          focus-visible:ring-2 focus-visible:ring-accent-primary/30
          after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
          after:w-2.5 after:h-2.5 after:rounded-[3.75px] after:bg-accent-primary after:transition-opacity after:duration-150
          after:opacity-0 checked:after:opacity-100
        `}
      />
      {label && (
        <span className="text-sm font-jakarta text-content-primary">
          {label}
        </span>
      )}
    </label>
  );
};
