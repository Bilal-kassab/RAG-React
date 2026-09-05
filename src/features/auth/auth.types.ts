export interface AuthUser {
  userId: number;
  phone: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface AuthCredentials {
  phone: string;
  password: string;
}
