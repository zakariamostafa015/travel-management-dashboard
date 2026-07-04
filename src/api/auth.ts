import { api } from "@/lib/api";
import type { AuthenticatedUser, AuthTokenResponse } from "@/types/api";

export type LoginPayload = {
  username: string;
  password: string;
};

export type RefreshPayload = {
  refreshToken: string;
};

export const authClient = {
  login: (payload: LoginPayload) => api.post<AuthTokenResponse>("/auth/login", payload),
  refresh: (payload: RefreshPayload) => api.post<AuthTokenResponse>("/auth/refresh", payload),
  revoke: (payload: RefreshPayload) => api.post<void>("/auth/revoke", payload),
  me: () => api.get<AuthenticatedUser>("/auth/me"),
};

