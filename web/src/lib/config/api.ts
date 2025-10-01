export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  me: "/auth/me",
  generateNickname: "/auth/generate-nickname",
  refreshToken: "/auth/refresh-token",
} as const;

export const USERS_ENDPOINTS = {
  profile: (id: string) => `/users/${id}`,
  updateProfile: (id: string) => `/users/${id}`,
  uploadAvatar: "/users/file",
  follow: (id: string) => `/users/${id}/follow`,
  unfollow: (id: string) => `/users/${id}/unfollow`,
  followers: (id: string) => `/users/${id}/followers`,
  following: (id: string) => `/users/${id}/following`,
} as const;

export const POSTS_ENDPOINTS = {
  list: "/posts",
  create: "/posts",
  detail: (id: string) => `/posts/${id}`,
  update: (id: string) => `/posts/${id}`,
  delete: (id: string) => `/posts/${id}`,
  search: "/posts/search",
  trendingTags: "/posts/trending",
} as const;

export const TAGS_ENDPOINTS = {
  trending: "/tags/trending",
  list: "/tags",
} as const;

export const COMMENTS_ENDPOINTS = {
  list: (postId: string) => `/posts/${postId}/comments`,
  create: (postId: string) => `/posts/${postId}/comments`,
  delete: (id: string) => `/comments/${id}`,
} as const;

export const LIKES_ENDPOINTS = {
  like: (id: string) => `/posts/${id}/like`,
  unlike: (id: string) => `/posts/${id}/unlike`,
} as const;

export const REPORTS_ENDPOINTS = {
  reportPost: (id: string) => `/posts/${id}/report`,
  reportComment: (id: string) => `/comments/${id}/report`,
  postReportCount: (id: string) => `/posts/${id}/reports/count`,
  commentReportCount: (id: string) => `/comments/${id}/reports/count`,
} as const;
