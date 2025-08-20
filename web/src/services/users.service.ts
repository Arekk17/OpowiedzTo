import { apiClient } from "@/lib/api/client";
import { USERS_ENDPOINTS } from "@/lib/config/api";
import { User } from "@/types/user";

export const getUser = async (id: string): Promise<User> => {
  try {
    return await apiClient.get<User>(USERS_ENDPOINTS.profile(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania użytkownika"
    );
  }
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  try {
    return await apiClient.patch<User>(USERS_ENDPOINTS.updateProfile(id), data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd aktualizacji użytkownika"
    );
  }
};

export const uploadAvatar = async (
  file: File
): Promise<{ filename: string; path: string }> => {
  try {
    return await apiClient.uploadFile<{ filename: string; path: string }>(
      USERS_ENDPOINTS.uploadAvatar,
      file
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd uploadu avataru"
    );
  }
};

export const followUser = async (id: string): Promise<void> => {
  try {
    await apiClient.post(USERS_ENDPOINTS.follow(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd followowania użytkownika"
    );
  }
};

export const unfollowUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(USERS_ENDPOINTS.unfollow(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd unfollowowania użytkownika"
    );
  }
};

export const getFollowers = async (id: string): Promise<User[]> => {
  try {
    return await apiClient.get<User[]>(USERS_ENDPOINTS.followers(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania followersów"
    );
  }
};

export const getFollowing = async (id: string): Promise<User[]> => {
  try {
    return await apiClient.get<User[]>(USERS_ENDPOINTS.following(id));
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Błąd pobierania following"
    );
  }
};
