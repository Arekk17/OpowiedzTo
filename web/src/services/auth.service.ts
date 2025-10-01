import { api } from "@/lib/api/client";
import { AUTH_ENDPOINTS } from "@/lib/config/api";
import { LoginFormData, RegisterApiData } from "@/types/auth";

export interface AuthApiResponse {
  accessToken: string;
  userId: string;
  nickname: string;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
}

export const login = async (data: LoginFormData): Promise<AuthApiResponse> => {
  return api.post<AuthApiResponse>(AUTH_ENDPOINTS.login, data);
};

export const register = async (
  data: RegisterApiData
): Promise<AuthApiResponse> => {
  return api.post<AuthApiResponse>(AUTH_ENDPOINTS.register, data);
};

export const logout = async (): Promise<{ message: string }> => {
  return api.post<{ message: string }>(AUTH_ENDPOINTS.logout);
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  return api.get<CurrentUserResponse>(AUTH_ENDPOINTS.me);
};

export const generateNickname = async (): Promise<{ nickname: string }> => {
  return api.get<{ nickname: string }>(AUTH_ENDPOINTS.generateNickname);
};

export const refreshToken = async (): Promise<AuthApiResponse> => {
  return api.post<AuthApiResponse>(AUTH_ENDPOINTS.refreshToken);
};
