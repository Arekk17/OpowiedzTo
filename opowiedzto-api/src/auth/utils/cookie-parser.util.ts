import { Request } from 'express';

export function extractCookieValue(
  request: Request,
  cookieName: string,
): string | null {
  const cookies = request.headers.cookie;

  // Debug: log all cookies
  console.log(`[DEBUG] All cookies for ${cookieName}:`, cookies);

  if (!cookies) {
    console.log(`[DEBUG] No cookies found for ${cookieName}`);
    return null;
  }

  const cookieArray = cookies.split(';');

  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      console.log(`[DEBUG] Found ${cookieName}:`, value);
      return value;
    }
  }

  console.log(`[DEBUG] Cookie ${cookieName} not found in:`, cookieArray);
  return null;
}
