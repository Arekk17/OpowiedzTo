import { api } from "@/lib/api/client";
import { USERS_ENDPOINTS } from "@/lib/config/api";
import { User } from "@/types/user";

export const getUser = async (id: string): Promise<User> => {
  return api.get<User>(USERS_ENDPOINTS.profile(id));
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  return api.patch<User>(USERS_ENDPOINTS.updateProfile(id), data);
};

export const uploadAvatar = async (
  file: File
): Promise<{ filename: string; path: string }> => {
  return api.uploadFile<{ filename: string; path: string }>(
    USERS_ENDPOINTS.uploadAvatar,
    file
  );
};

export const followUser = async (id: string): Promise<void> => {
  return api.post(USERS_ENDPOINTS.follow(id));
};

export const unfollowUser = async (id: string): Promise<void> => {
  return api.delete(USERS_ENDPOINTS.unfollow(id));
};

export const getFollowers = async (id: string): Promise<User[]> => {
  return api.get<User[]>(USERS_ENDPOINTS.followers(id));
};

export const getFollowing = async (id: string): Promise<User[]> => {
  return api.get<User[]>(USERS_ENDPOINTS.following(id));
};
