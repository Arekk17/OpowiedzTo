"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
  AuthApiResponse,
  CurrentUserResponse,
} from "@/services/auth.service";
import { LoginFormData, RegisterFormData } from "@/types/auth";

const AUTH_KEYS = {
  user: ["auth", "user"] as const,
};

interface AuthState {
  user: CurrentUserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: getCurrentUser,
    enabled: isInitialized,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => loginApi(data),
    onSuccess: (data: AuthApiResponse) => {
      queryClient.setQueryData(AUTH_KEYS.user, {
        id: data.userId,
        email: "",
        nickname: data.nickname,
        createdAt: new Date().toISOString(),
      });
      refetchUser();
      router.push("/profile");
    },
    onError: (error: AxiosError) => {
      console.error("Login error:", error);
      queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerApi(data),
    onSuccess: (data: AuthApiResponse, variables: RegisterFormData) => {
      queryClient.setQueryData(AUTH_KEYS.user, {
        id: data.userId,
        email: variables.email,
        nickname: data.nickname,
        createdAt: new Date().toISOString(),
      });
      refetchUser();
      router.push("/profile");
    },
    onError: (error: AxiosError) => {
      console.error("Register error:", error);
      queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      router.push("/auth/login");
    },
    onError: (error: AxiosError) => {
      console.error("Logout error:", error);
      queryClient.clear();
      router.push("/auth/login");
    },
  });

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (userError && (userError as AxiosError)?.response?.status === 401) {
      logoutMutation.mutate();
    }
  }, [userError, logoutMutation]);

  const authState: AuthState = {
    user: user || null,
    isLoading: isLoadingUser && !isInitialized,
    isAuthenticated: !!user,
  };

  return {
    ...authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    refetchUser,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    userError,
    isInitialized,
  };
}

export function useRequireAuth(redirectTo = "/auth/login") {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return { user, isLoading, isAuthenticated };
}

export function useRequireGuest(redirectTo = "/profile") {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return { user, isLoading, isAuthenticated };
}

export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
}
