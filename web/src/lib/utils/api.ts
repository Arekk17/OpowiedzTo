import type { ApiResponse, CursorMeta } from "@/types/api";

export function adaptCursorResponse<T>(
  res: ApiResponse<T, CursorMeta> | { data: T; nextCursor: string | null }
): ApiResponse<T, CursorMeta> {
  if ((res as ApiResponse<T, CursorMeta>).meta)
    return res as ApiResponse<T, CursorMeta>;
  const flat = res as { data: T; nextCursor: string | null };
  return { data: flat.data, meta: { nextCursor: flat.nextCursor } };
}
