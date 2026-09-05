import { http } from "../../shared/api/http";
import type { AuthCredentials, AuthResponse, AuthUser } from "./auth.types";

export const authApi = {
  async login(payload: AuthCredentials): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  async register(payload: AuthCredentials): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>("/auth/register", payload);
    return data;
  },
  async me(): Promise<AuthUser> {
    const { data } = await http.get<AuthUser>("/auth/me");
    return data;
  },
};
