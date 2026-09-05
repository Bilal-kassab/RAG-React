import axios, { AxiosError } from "axios";
import { tokenService } from "../auth/tokenService";
import { env } from "../utils/env";

export interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = tokenService.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && tokenService.get()) {
      tokenService.clear();
    }
    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join("، ");
    if (typeof message === "string" && message.trim()) return message;
    if (error.code === "ECONNABORTED") return "انتهت مهلة الاتصال بالخادم.";
    if (!error.response) return "تعذر الاتصال بالخادم. تحقق من عنوان الـ API والشبكة.";
  }
  return error instanceof Error ? error.message : "حدث خطأ غير متوقع.";
};
