import React from "react";
import { BrandSection } from "../../molecules/branding/BrandSection";

import { getAuthUser } from "@/lib/auth-ssr";
import { AuthenticatedActions } from "@/components/molecules/user-actions/AuthenticatedActions";
import { UnauthenticatedActions } from "@/components/molecules/user-actions/UnauthenticatedActions";

const Header = async () => {
  const user = await getAuthUser();
  return (
    <header className="sticky top-0 z-50 w-full h-[65px] bg-background-paper border-b border-ui-border">
      <div className="mx-auto w-full max-w-[1440px] flex items-center justify-between px-10 py-3 h-full">
        <BrandSection />
        <div className="flex items-center gap-4">
          {user ? (
            <AuthenticatedActions user={user} />
          ) : (
            <UnauthenticatedActions />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
