import React from "react";

interface FilterLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: "column" | "row";
}

export const FilterLayout: React.FC<FilterLayoutProps> = ({
  title,
  children,
  className = "",
  variant = "column",
}) => {
  if (variant === "row") {
    return (
      <div
        className={`
          flex flex-row flex-wrap items-start content-start
          px-4 py-3 pl-3 gap-3
          w-80 min-h-[159px]
          ${className}
        `}
      >
        <div
          className={`
            flex flex-col items-start
            px-4 py-4 pb-2
            w-[295px] h-[47px]
          `}
        >
          <h2
            className={`
              w-[263px] h-[23px]
              font-jakarta font-bold text-lg leading-[23px]
              text-content-primary
            `}
          >
            {title}
          </h2>
        </div>
        <div className="flex flex-row flex-wrap gap-3 w-full">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col items-start
        p-4 pb-2
        w-80 min-h-[274px]
        ${className}
      `}
    >
      <div
        className={`
          flex flex-col items-start
          p-4 gap-3
          w-72 h-[250px]
        `}
      >
        <h2
          className={`
            w-64 h-[23px]
            font-jakarta font-bold text-lg leading-[23px]
            text-content-primary
          `}
        >
          {title}
        </h2>
        <div className="flex flex-col gap-3 w-full">{children}</div>
      </div>
    </div>
  );
};
