import React from "react";
import { BrandSection } from "../../molecules/branding/BrandSection";
import { UserActions } from "../../molecules/user-actions/UserAction";

const Header = () => {
  return (
    <header className="w-full h-[65px] bg-background-paper border-b border-ui-border">
      <div className="flex items-center justify-between px-10 py-3 h-full">
        <BrandSection />
        <UserActions />
      </div>
    </header>
  );
};

export default Header;
