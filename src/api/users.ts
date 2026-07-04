import { api } from "@/lib/api";
import type { PagedQuery, PagedResult, User, UserRole } from "@/types/api";

export type UserQuery = PagedQuery & {
  role?: UserRole | string;
  isActive?: boolean | string;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
};

export type UpdateUserPayload = {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImagePath: string | null;
  role: UserRole;
  isActive: boolean;
  emailConfirmed: boolean;
};

export const usersClient = {
  listUsers: (query: UserQuery = {}) => api.get<PagedResult<User>>("/admin/users", query),
  getUser: (id: number) => api.get<User>(`/admin/users/${id}`),
  getUserByUsername: (username: string) => api.get<User>(`/admin/users/by-username/${username}`),
  createUser: (payload: CreateUserPayload) => api.post<User>("/admin/users", payload),
  updateUser: (id: number, payload: UpdateUserPayload) => api.put<User>(`/admin/users/${id}`, payload),
  changePassword: (id: number, payload: { userId: number; currentPassword: string; newPassword: string }) =>
    api.patch<void>(`/admin/users/${id}/password`, payload),
  resetPassword: (id: number, payload: { userId: number; newPassword: string }) =>
    api.patch<void>(`/admin/users/${id}/password/reset`, payload),
  deleteUser: (id: number) => api.delete<void>(`/admin/users/${id}`),
  reactivateUser: (id: number) => api.patch<void>(`/admin/users/${id}/reactivate`),
};

