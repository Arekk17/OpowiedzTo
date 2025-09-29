import { apiClient } from "@/lib/api/client";
import { AUTH_ENDPOINTS } from "@/lib/config/api";
import { LoginFormData, RegisterApiData } from "@/types/auth";
import { emit } from "@/lib/auth/events";

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
  try {
    const resp = await apiClient.post<AuthApiResponse>(
      AUTH_ENDPOINTS.login,
      data
    );
    emit("auth:login");
    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Błąd logowania");
  }
};

export const register = async (
  data: RegisterApiData
): Promise<AuthApiResponse> => {
  try {
    const resp = await apiClient.post<AuthApiResponse>(
      AUTH_ENDPOINTS.register,
      data
    );
    emit("auth:register");
    return resp;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd rejestracji"
    );
  }
};

export const logout = async (): Promise<{ message: string }> => {
  try {
    const resp = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.logout
    );
    emit("auth:logout");
    return resp;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd wylogowania"
    );
  }
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    return apiClient.get<CurrentUserResponse>(AUTH_ENDPOINTS.me);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania użytkownika"
    );
  }
};

export const generateNickname = async (): Promise<{ nickname: string }> => {
  try {
    return apiClient.get<{ nickname: string }>(AUTH_ENDPOINTS.generateNickname);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd generowania nicku"
    );
  }
};
export const refreshToken = async (): Promise<AuthApiResponse> => {
  try {
    return apiClient.post<AuthApiResponse>(AUTH_ENDPOINTS.refreshToken);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd odświeżenia tokenu"
    );
  }
};
