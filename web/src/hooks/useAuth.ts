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
    retry: false,
  });

  useEffect(() => {
    if (user && (user as { expiresAt?: number }).expiresAt) {
      setTokenExpiresAt((user as { expiresAt: number }).expiresAt);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !tokenExpiresAt) return;

    const timeUntilExpiry = tokenExpiresAt - Date.now();
    const oneMinuteBeforeExpiry = timeUntilExpiry - 60 * 1000;

    if (oneMinuteBeforeExpiry <= 0) {
      console.log("[useAuth] Token expired or about to expire, refreshing now");
      fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.expiresAt && data.serverTime) {
            const clientTime = Date.now();
            const timeDiff = clientTime - data.serverTime;
            const adjustedExpiresAt = data.expiresAt + timeDiff;

            setTokenExpiresAt(adjustedExpiresAt);
            console.log(
              "[useAuth] Token refreshed, new expiry:",
              new Date(adjustedExpiresAt).toISOString()
            );
          }
          refetch();
        });
      return;
    }

    console.log("[useAuth] Setting refresh timer:", {
      tokenExpiresAt: new Date(tokenExpiresAt).toISOString(),
      currentTime: new Date().toISOString(),
      refreshIn: Math.floor(oneMinuteBeforeExpiry / 1000) + " seconds",
    });

    const timeoutId = setTimeout(async () => {
      try {
        console.log("[useAuth] Auto-refreshing token (scheduled)");
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success && data.expiresAt && data.serverTime) {
          const clientTime = Date.now();
          const timeDiff = clientTime - data.serverTime;
          const adjustedExpiresAt = data.expiresAt + timeDiff;

          setTokenExpiresAt(adjustedExpiresAt);
          console.log(
            "[useAuth] Token refreshed, new expiry:",
            new Date(adjustedExpiresAt).toISOString()
          );
        }

        refetch();
      } catch (error) {
        console.error("Scheduled refresh failed:", error);
      }
    }, oneMinuteBeforeExpiry);

    return () => clearTimeout(timeoutId);
  }, [user, tokenExpiresAt, refetch]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("[useAuth] Login successful, redirecting to:", callbackUrl);

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
      router.refresh();
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
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
      router.refresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      setTokenExpiresAt(null);
      router.push("/auth/login");
      router.refresh();
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
