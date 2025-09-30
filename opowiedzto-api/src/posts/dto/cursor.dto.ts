export interface FeedCursor {
  createdAt: string;
  id: string;
  likesCount?: number;
  commentsCount?: number;
}

function isFeedCursor(v: unknown): v is FeedCursor {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  const hasBase = typeof o.createdAt === 'string' && typeof o.id === 'string';
  const likesOk =
    o.likesCount === undefined || typeof o.likesCount === 'number';
  const commentsOk =
    o.commentsCount === undefined || typeof o.commentsCount === 'number';
  return hasBase && likesOk && commentsOk;
}

export const decodeCursor = (s?: string | null): FeedCursor | null => {
  if (!s) return null;
  try {
    const raw: unknown = JSON.parse(Buffer.from(s, 'base64').toString('utf-8'));
    if (!isFeedCursor(raw)) return null;
    return raw;
  } catch {
    return null;
  }
};

export const encodeCursor = (cursor: FeedCursor | null): string | null =>
  cursor ? Buffer.from(JSON.stringify(cursor)).toString('base64') : null;
