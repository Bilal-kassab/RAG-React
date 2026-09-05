const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

const apiBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL?.trim() || "/api");
const socketBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_SOCKET_BASE_URL?.trim() || window.location.origin,
);

export const env = {
  apiBaseUrl,
  socketBaseUrl,
} as const;
