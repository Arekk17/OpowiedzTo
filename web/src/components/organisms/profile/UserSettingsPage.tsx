"use client";

import React, { useState } from "react";
import { SettingsTabs } from "@/components/molecules/forms/SettingsTabs";
import { ProfileForm } from "@/components/organisms/forms/ProfileForm";
import { AccountManagement } from "@/components/organisms/forms/AccountManagement";
import { PasswordForm } from "@/components/organisms/forms/PasswordForm";
import { useAuth } from "@/hooks/useAuth";

interface UserSettingsPageProps {
  userId: string;
}

export const UserSettingsPage: React.FC<UserSettingsPageProps> = ({
  userId,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">(
    "profile"
  );

  const handleProfileSubmit = async (
    data: Parameters<React.ComponentProps<typeof ProfileForm>["onSubmit"]>[0]
  ) => {
    // TODO: Implement profile update
    console.log("Profile update:", data);
  };

  const handlePasswordSubmit = async (
    data: Parameters<React.ComponentProps<typeof PasswordForm>["onSubmit"]>[0]
  ) => {
    // TODO: Implement password change
    console.log("Password change:", data);
  };

  const handleDeactivateAccount = async () => {
    // TODO: Implement account deactivation
    console.log("Deactivate account");
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    console.log("Delete account");
  };

  if (!user || user.id !== userId) {
    return (
      <div className="min-h-screen bg-background-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-content-primary mb-2">
            Brak dostępu
          </h1>
          <p className="text-content-secondary">
            Możesz edytować tylko swoje ustawienia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-subtle">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-background-paper rounded-2xl border border-ui-border shadow-sm">
          {/* Header */}
          <div className="border-b border-ui-border p-6">
            <h1 className="font-jakarta font-bold text-2xl text-content-primary">
              Ustawienia konta
            </h1>
            <p className="text-content-secondary mt-1">
              Zarządzaj swoimi danymi i preferencjami
            </p>
          </div>

          {/* Navigation Tabs */}
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <ProfileForm user={user} onSubmit={handleProfileSubmit} />
            )}
            {activeTab === "password" && (
              <PasswordForm onSubmit={handlePasswordSubmit} />
            )}
            {activeTab === "danger" && (
              <AccountManagement
                onDeactivate={handleDeactivateAccount}
                onDelete={handleDeleteAccount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
