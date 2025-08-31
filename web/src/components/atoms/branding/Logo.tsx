import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-4 w-[146px] h-[23px]">
      <div className="w-4 h-4 bg-primary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L16 8L8 16L0 8L8 0Z" fill="currentColor" />
        </svg>
      </div>
      <h1 className="text-primary font-bold text-lg font-jakarta leading-[23px]">
        Opowiedz to
      </h1>
    </div>
  );
};
