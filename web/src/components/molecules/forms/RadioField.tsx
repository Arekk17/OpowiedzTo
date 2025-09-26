"use client";
import React from "react";
import { Radio } from "../../atoms/inputs/Radio";

interface RadioFieldProps {
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  className?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({
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
    <div
      className={`
        flex flex-row items-center cursor-pointer select-none
        p-[15px] gap-4
        w-full max-w-[288px] h-[53px]
        border border-ui-border rounded-xl
        ${className}
      `}
      role="radio"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onChange?.(true)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange?.(true);
        }
      }}
    >
      <Radio
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="flex-1 text-sm font-jakarta font-medium text-content-primary leading-[21px]">
        {label}
      </span>
    </div>
  );
};
