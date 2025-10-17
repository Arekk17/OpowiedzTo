import { apiRequest } from "@/lib/auth";
import { AUTH_ENDPOINTS } from "@/lib/config/api";
import { LoginFormData, RegisterApiData } from "@/types/auth";

export interface AuthApiResponse {
  accessToken: string;
  userId: string;
  nickname: string;
  expiresAt: number;
  serverTime: number;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
  expiresAt?: number;
}

export const login = async (data: LoginFormData): Promise<AuthApiResponse> => {
  return apiRequest<AuthApiResponse>(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(data),
    skipRefreshOn401: true,
  });
};

export const register = async (
  data: RegisterApiData,
): Promise<AuthApiResponse> => {
  return apiRequest<AuthApiResponse>(AUTH_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(data),
    skipRefreshOn401: true,
  });
};

export const logout = async (): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(AUTH_ENDPOINTS.logout, {
    method: "POST",
  });
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  return apiRequest<CurrentUserResponse>(AUTH_ENDPOINTS.me);
  // Bez żadnych opcji - niech apiRequest sam obsłuży refresh
};

export const generateNickname = async (): Promise<{ nickname: string }> => {
  return apiRequest<{ nickname: string }>(AUTH_ENDPOINTS.generateNickname);
};

export const refreshToken = async (): Promise<AuthApiResponse> => {
  return apiRequest<AuthApiResponse>(AUTH_ENDPOINTS.refreshToken);
};
