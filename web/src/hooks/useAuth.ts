"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  login,
  register,
  logout,
  getCurrentUser,
} from "@/services/auth.service";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const isAuthPage = pathname?.startsWith("/auth/");
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard/profile";

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getCurrentUser,
    enabled: !isAuthPage,
    staleTime: 5 * 60 * 1000,
    retry: false, // ← Nie retry, niech apiRequest sam obsłuży refresh
  });

  useEffect(() => {
    if (user && (user as { expiresAt?: number }).expiresAt) {
      setTokenExpiresAt((user as { expiresAt: number }).expiresAt);
    }
  }, [user]);

  // Prosty periodic refresh
  useEffect(() => {
    if (!user || !tokenExpiresAt) return;

    const interval = setInterval(async () => {
      const timeUntilExpiry = tokenExpiresAt - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      console.log("[useAuth] Token expiry check:", {
        tokenExpiresAt,
        currentTime: Date.now(),
        timeUntilExpiry,
        willRefresh: timeUntilExpiry < fiveMinutes,
      });

      if (timeUntilExpiry < fiveMinutes) {
        try {
          console.log("[useAuth] Auto-refreshing token (periodic check)");
          await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });
          refetch();
        } catch (error) {
          console.error("Periodic refresh failed:", error);
        }
      }
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, tokenExpiresAt, refetch]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("[useAuth] Login successful, redirecting to:", callbackUrl);

      // Oblicz czas wygaśnięcia względem czasu klienta
      const clientTime = Date.now();
      const timeDiff = clientTime - data.serverTime;
      const adjustedExpiresAt = data.expiresAt + timeDiff;

      queryClient.setQueryData(["auth", "user"], {
        id: data.userId,
        email: "",
        nickname: data.nickname,
        createdAt: new Date().toISOString(),
        expiresAt: adjustedExpiresAt, // ← Skorygowany czas
      });
      setTokenExpiresAt(adjustedExpiresAt);
      router.push(callbackUrl);
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // To samo co w login
      const clientTime = Date.now();
      const timeDiff = clientTime - data.serverTime;
      const adjustedExpiresAt = data.expiresAt + timeDiff;

      queryClient.setQueryData(["auth", "user"], {
        id: data.userId,
        email: "",
        nickname: data.nickname,
        createdAt: new Date().toISOString(),
        expiresAt: adjustedExpiresAt,
      });
      setTokenExpiresAt(adjustedExpiresAt);
      router.push(callbackUrl);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      setTokenExpiresAt(null);
      router.push("/auth/login");
    },
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    signin: loginMutation.mutate,
    signup: registerMutation.mutate,
    signout: logoutMutation.mutate,
    refetch,
    isSigningIn: loginMutation.isPending,
    isSigningUp: registerMutation.isPending,
    isSigningOut: logoutMutation.isPending,
    signinError: loginMutation.error,
    signupError: registerMutation.error,
  };
}
