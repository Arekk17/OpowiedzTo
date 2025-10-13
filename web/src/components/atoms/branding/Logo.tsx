import React from "react";
import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center gap-4 w-[146px] h-[23px]">
      <Image
        src="/images/opowiedzt-to-logo.png"
        alt="Opowiedz to"
        width={146}
        height={23}
      />
    </div>
  );
};
