const ACCESS_TOKEN_KEY = "medixa_chat_access_token";

export const tokenService = {
  get(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.dispatchEvent(new Event("medixa-auth-changed"));
  },
  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.dispatchEvent(new Event("medixa-auth-changed"));
  },
};
