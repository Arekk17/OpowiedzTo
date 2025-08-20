let tokenInMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
  tokenInMemory = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = (): string | null => {
  if (tokenInMemory) return tokenInMemory;
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};
