import React from "react";
import { PageLayout } from "@/components/organisms/layout/PageLayout";
import { getAuthUser } from "@/lib/auth-ssr";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <PageLayout className="flex-col">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-background-paper p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Witaj, {user.nickname}!
          </h2>
          <p className="text-muted-foreground">
            To jest twoja strona główna. Tutaj możesz zarządzać swoimi postami i
            ustawieniami.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
