import { apiRequest } from "@/lib/auth";
import { USERS_ENDPOINTS } from "@/lib/config/api";
import { User } from "@/types/user";

export const getUser = async (id: string): Promise<User> => {
  return apiRequest<User>(USERS_ENDPOINTS.profile(id), {
    method: "GET",
  });
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  return apiRequest<User>(USERS_ENDPOINTS.updateProfile(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const uploadAvatar = async (
  file: File
): Promise<{ filename: string; path: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<{ filename: string; path: string }>(
    USERS_ENDPOINTS.uploadAvatar,
    {
      method: "POST",
      body: formData,
    }
  );
};

export const followUser = async (id: string): Promise<void> => {
  return apiRequest(USERS_ENDPOINTS.follow(id), {
    method: "POST",
  });
};

export const unfollowUser = async (id: string): Promise<void> => {
  return apiRequest(USERS_ENDPOINTS.unfollow(id), {
    method: "DELETE",
  });
};

export const getFollowers = async (id: string): Promise<User[]> => {
  return apiRequest<User[]>(USERS_ENDPOINTS.followers(id), {
    method: "GET",
  });
};

export const getFollowing = async (id: string): Promise<User[]> => {
  return apiRequest<User[]>(USERS_ENDPOINTS.following(id), {
    method: "GET",
  });
};
