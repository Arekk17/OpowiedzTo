import { z } from "zod";

export type ApiResponse<TData, TMeta = unknown> = {
  data: TData;
  meta: TMeta;
};
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type CursorMeta = { nextCursor: string | null };

export type PagedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const searchSchema = paginationSchema.extend({
  q: z.string().trim().optional(),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationData = z.infer<typeof paginationSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type SortData = z.infer<typeof sortSchema>;
