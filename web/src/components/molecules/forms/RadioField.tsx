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
        flex flex-row items-center
        p-[15px] gap-4
        w-full max-w-[288px] h-[53px]
        border border-ui-border rounded-xl
        ${className}
      `}
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
