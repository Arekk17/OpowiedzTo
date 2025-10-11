import { z } from "zod";
import { Gender } from "./auth";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
export interface User extends BaseEntity {
  email: string;
  nickname: string;
  gender: Gender;
  avatar?: string;
}
export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postCount: number;
  isFollowing?: boolean;
}
export interface Follow extends BaseEntity {
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
}
export interface UpdateProfileForm {
  nickname?: string;
  gender?: Gender;
  avatar?: string;
}

export const updateProfileSchema = z.object({
  nickname: z
    .string()
    .regex(
      /^[a-zA-Z0-9_-]{3,20}$/,
      "Nickname może zawierać tylko litery, cyfry, podkreślenia i myślniki (3-20 znaków)"
    )
    .optional(),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  avatar: z.string().optional(),
});
export const userFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  q: z.string().optional(),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UserFiltersData = z.infer<typeof userFiltersSchema>;
