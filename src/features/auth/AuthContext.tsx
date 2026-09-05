import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "./auth.api";
import type { AuthCredentials, AuthUser } from "./auth.types";
import { tokenService } from "../../shared/auth/tokenService";

interface AuthContextValue {
  user: AuthUser | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = tokenService.get();
    if (!token) {
      setUser(null);
      setIsBootstrapping(false);
      return;
    }

    try {
      setUser(await authApi.me());
    } catch {
      tokenService.clear();
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
    const sync = () => {
      if (!tokenService.get()) setUser(null);
    };
    window.addEventListener("medixa-auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("medixa-auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [bootstrap]);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const response = await authApi.login(credentials);
    tokenService.set(response.accessToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (credentials: AuthCredentials) => {
    const response = await authApi.register(credentials);
    tokenService.set(response.accessToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    tokenService.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isBootstrapping,
      isAuthenticated: Boolean(user && tokenService.get()),
      login,
      register,
      logout,
    }),
    [user, isBootstrapping, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
