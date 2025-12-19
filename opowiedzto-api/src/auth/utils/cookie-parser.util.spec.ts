import { extractCookieValue } from './cookie-parser.util';

describe('extractCookieValue', () => {
  it('zwraca wartość z nagłówka cookie', () => {
    const request = {
      headers: { cookie: 'refreshToken=abc123; accessToken=xyz' },
    } as any;

    expect(extractCookieValue(request, 'refreshToken')).toBe('abc123');
  });

  it('zwraca null, gdy nagłówek nie istnieje', () => {
    const request = { headers: {} } as any;
    expect(extractCookieValue(request, 'refreshToken')).toBeNull();
  });

  it('zwraca null, gdy cookie nie znaleziono', () => {
    const request = {
      headers: { cookie: 'accessToken=xyz' },
    } as any;
    expect(extractCookieValue(request, 'refreshToken')).toBeNull();
  });
});



