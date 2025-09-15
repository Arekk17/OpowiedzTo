import React from "react";
import { BrandSection } from "../../molecules/branding/BrandSection";
import { UserActions as DefaultUserActions } from "../../molecules/user-actions/UserAction";

type HeaderProps = {
  UserActionsComponent?: React.ComponentType;
};

const Header: React.FC<HeaderProps> = ({
  UserActionsComponent = DefaultUserActions,
}) => {
  return (
    <header className="w-full h-[65px] bg-background-paper border-b border-ui-border">
      <div className="flex items-center justify-between px-10 py-3 h-full">
        <BrandSection />
        <UserActionsComponent />
      </div>
    </header>
  );
};

export default Header;
