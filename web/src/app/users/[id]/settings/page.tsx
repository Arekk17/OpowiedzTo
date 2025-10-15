import React from "react";
import { UserSettingsPage } from "@/components/organisms/profile/UserSettingsPage";

interface UserSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserSettingsPageRoute({
  params,
}: UserSettingsPageProps) {
  const { id } = await params;

  return <UserSettingsPage userId={id} />;
}
