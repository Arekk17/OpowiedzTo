"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import {
  login,
  register,
  logout,
  getCurrentUser,
} from "@/services/auth.service";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);

  const isAuthPage = pathname?.startsWith("/auth/");

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getCurrentUser,
    enabled: !isAuthPage,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if ((error as { status?: number })?.status === 401) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (user && (user as { expiresAt?: number }).expiresAt) {
      setTokenExpiresAt((user as { expiresAt: number }).expiresAt);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !tokenExpiresAt) return;

    const checkAndRefresh = async () => {
      const timeUntilExpiry = tokenExpiresAt - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeUntilExpiry < fiveMinutes) {
        try {
          await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });
          refetch();
        } catch {}
      }
    };

    const interval = setInterval(checkAndRefresh, 2 * 60 * 1000);
    checkAndRefresh();

    return () => clearInterval(interval);
  }, [user, tokenExpiresAt, refetch]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], {
        id: data.userId,
        email: "",
        nickname: data.nickname,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
      });
      setTokenExpiresAt(data.expiresAt);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], {
        id: data.userId,
        email: "",
        nickname: data.nickname,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
      });
      setTokenExpiresAt(data.expiresAt);
      router.push("/dashboard");
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
  };
}
