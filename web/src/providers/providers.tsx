"use client";

import { useEffect, useRef } from "react";
import { QueryProvider } from "./query-provider";
import { on } from "@/lib/auth/events";
import { apiClient } from "@/lib/api/client";
import { AUTH_ENDPOINTS } from "@/lib/config/api";

function useTokenRefreshScheduler() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleTokenRefresh = (expiresInSeconds: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const ms = Math.max(0, (expiresInSeconds - 5 * 60) * 1000);
    timerRef.current = setTimeout(async () => {
      try {
        await apiClient.post(AUTH_ENDPOINTS.refreshToken);
      } catch {}
    }, ms);
  };

  useEffect(() => {
    const unsubLogin = on("auth:login", () => scheduleTokenRefresh(15 * 60));
    const unsubRegister = on("auth:register", () =>
      scheduleTokenRefresh(15 * 60)
    );
    const unsubRefreshed = on("token:refreshed", () =>
      scheduleTokenRefresh(15 * 60)
    );
    const unsubLogout = on("auth:logout", () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    });

    return () => {
      unsubLogin();
      unsubRegister();
      unsubRefreshed();
      unsubLogout();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useTokenRefreshScheduler();
  return <QueryProvider>{children}</QueryProvider>;
}
