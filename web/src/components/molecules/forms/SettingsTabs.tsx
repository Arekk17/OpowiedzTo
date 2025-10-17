import React from "react";
import { clsx } from "clsx";

interface SettingsTabsProps {
  activeTab: "profile" | "password" | "danger";
  onTabChange: (tab: "profile" | "password" | "danger") => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-ui-border">
      <nav className="flex">
        <button
          onClick={() => onTabChange("profile")}
          className={clsx(
            "px-6 py-4 font-medium text-sm transition-colors",
            activeTab === "profile"
              ? "text-primary border-b-2 border-primary"
              : "text-content-secondary hover:text-content-primary",
          )}
        >
          Profil
        </button>
        <button
          onClick={() => onTabChange("password")}
          className={clsx(
            "px-6 py-4 font-medium text-sm transition-colors",
            activeTab === "password"
              ? "text-primary border-b-2 border-primary"
              : "text-content-secondary hover:text-content-primary",
          )}
        >
          Bezpieczeństwo
        </button>
        <button
          onClick={() => onTabChange("danger")}
          className={clsx(
            "px-6 py-4 font-medium text-sm transition-colors",
            activeTab === "danger"
              ? "text-accent-error border-b-2 border-accent-error"
              : "text-content-secondary hover:text-content-primary",
          )}
        >
          Konto
        </button>
      </nav>
    </div>
  );
};
