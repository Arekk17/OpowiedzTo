import { Request } from 'express';

export function extractCookieValue(
  request: Request,
  cookieName: string,
): string | null {
  const cookies = request.headers.cookie;

  if (!cookies) {
    return null;
  }

  const cookieArray = cookies.split(';');

  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }

  return null;
}
