import { apiClient } from "@/lib/api/client";
import { AUTH_ENDPOINTS } from "@/lib/config/api";
import { LoginFormData, RegisterFormData } from "@/types/auth";

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
    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Błąd logowania");
  }
};

export const register = async (
  data: RegisterFormData
): Promise<AuthApiResponse> => {
  try {
    const resp = await apiClient.post<AuthApiResponse>(
      AUTH_ENDPOINTS.register,
      data
    );
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
