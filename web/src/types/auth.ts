import { z } from "zod";
import { User } from "./user";

export type { User } from "./user";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
  gender?: Gender;
}

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Nieprawidłowy format email",
    }),
  password: z
    .string()
    .min(1, "Hasło jest wymagane")
    .min(8, "Hasło musi mieć minimum 8 znaków"),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email jest wymagany")
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Nieprawidłowy format email",
      }),
    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków")
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        "Hasło musi zawierać małe i wielkie litery, cyfry lub znaki specjalne"
      ),
    confirmPassword: z
      .string()
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi mieć minimum 8 znaków"),
    nickname: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9_-]{3,20}$/,
        "Nickname może zawierać tylko litery, cyfry, podkreślenia i myślniki (3-20 znaków)"
      )
      .optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export interface RegisterApiData {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthApiResponse {
  accessToken: string;
  userId: string;
  nickname: string;
  expiresAt: number;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  expiresAt?: number;
}
