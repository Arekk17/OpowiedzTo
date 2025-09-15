import React from "react";
import { LogoMarkIcon } from "../../assets/icons/LogoMarkIcon";

export const Logo = () => {
  return (
    <div className="flex items-center gap-4 w-[146px] h-[23px]">
      <div className="w-4 h-4 bg-primary">
        <LogoMarkIcon size={16} />
      </div>
      <h1 className="text-primary font-bold text-lg font-jakarta leading-[23px]">
        Opowiedz to
      </h1>
    </div>
  );
};
