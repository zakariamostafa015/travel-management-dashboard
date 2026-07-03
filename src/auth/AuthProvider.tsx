import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { api, clearStoredAuth, getStoredAuth, setStoredAuth } from "@/lib/api";
import type { AuthenticatedUser, AuthTokenResponse } from "@/types/api";

type AuthContextValue = {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const current = getStoredAuth();
    if (!current) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await api.get<AuthenticatedUser>("/auth/me");
      setUser(me);
    } catch {
      clearStoredAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (username: string, password: string) => {
    const tokens = await api.post<AuthTokenResponse>("/auth/login", { username, password });
    setStoredAuth(tokens);
    setUser(tokens.user);
    toast.success(`Welcome back, ${tokens.user.firstName || tokens.user.username}.`);
  }, []);

  const logout = useCallback(async () => {
    const current = getStoredAuth();
    try {
      if (current?.refreshToken) {
        await api.post("/auth/revoke", { refreshToken: current.refreshToken });
      }
    } catch {
      // Logout should always finish locally, even if revoke fails over the network.
    } finally {
      clearStoredAuth();
      setUser(null);
      toast.message("Signed out.");
    }
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refreshMe }), [loading, login, logout, refreshMe, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
