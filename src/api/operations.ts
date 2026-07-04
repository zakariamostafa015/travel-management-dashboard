import { api } from "@/lib/api";
import type {
  Department,
  Language,
  PagedQuery,
  PagedResult,
  ResourceContentItem,
  ResourceContentLanguage,
  SettingType,
  SiteSetting,
  TeamMember,
} from "@/types/api";

export type LanguagePayload = {
  id?: number;
  code: string;
  cultureCode: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type DepartmentPayload = {
  id?: number;
  sortOrder: number;
  isActive: boolean;
  translations: Array<{ language: string; name: string }>;
};

export type TeamMemberPayload = {
  id?: number;
  firstName: string;
  lastName: string;
  position: string;
  departmentId: number | null;
  email: string;
  bio: string | null;
  photoPath: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type SiteSettingPayload = {
  id?: number;
  key: string;
  value: string | null;
  description: string | null;
  category: string | null;
  iconClass: string | null;
  sortOrder: number;
  type: SettingType;
  isActive: boolean;
};

export type ResourceContentPayload = {
  key: string;
  translations: Record<string, string>;
};

export const operationsClient = {
  listLanguages: (query: PagedQuery & { isActive?: boolean | string } = {}) =>
    api.get<PagedResult<Language>>("/admin/languages", query),
  listActiveLanguageCodes: () => api.get<string[]>("/admin/languages/active-codes"),
  getDefaultLanguage: () => api.get<Language>("/admin/languages/default"),
  getLanguage: (id: number) => api.get<Language>(`/admin/languages/${id}`),
  upsertLanguage: (payload: LanguagePayload) => api.put<Language>("/admin/languages", payload),
  deleteLanguage: (id: number) => api.delete<void>(`/admin/languages/${id}`),
  setDefaultLanguage: (id: number) => api.patch<void>(`/admin/languages/${id}/default`),
  toggleLanguageStatus: (id: number) => api.patch<void>(`/admin/languages/${id}/toggle-status`),
  listDepartments: (query: PagedQuery & { language?: string; isActive?: boolean | string } = {}) =>
    api.get<PagedResult<Department>>("/admin/departments", query),
  upsertDepartment: (payload: DepartmentPayload) => api.put<Department>("/admin/departments", payload),
  deleteDepartment: (id: number) => api.delete<void>(`/admin/departments/${id}`),
  listTeamMembers: (query: PagedQuery & { departmentId?: number | string; isActive?: boolean | string } = {}) =>
    api.get<PagedResult<TeamMember>>("/admin/team-members", query),
  upsertTeamMember: (payload: TeamMemberPayload) => api.put<TeamMember>("/admin/team-members", payload),
  deleteTeamMember: (id: number) => api.delete<void>(`/admin/team-members/${id}`),
  listSettings: (query: PagedQuery & { category?: string; isActive?: boolean | string } = {}) =>
    api.get<PagedResult<SiteSetting>>("/admin/settings", query),
  upsertSetting: (payload: SiteSettingPayload) => api.put<SiteSetting>("/admin/settings", payload),
  deleteSetting: (id: number) => api.delete<void>(`/admin/settings/${id}`),
  listResourceLanguages: () => api.get<ResourceContentLanguage[]>("/admin/resources/languages"),
  getLanguageContent: (cultureCode: string) => api.get<Record<string, string>>(`/admin/resources/${cultureCode}`),
  getResourceItem: (key: string) => api.get<ResourceContentItem>(`/admin/resources/items/${key}`),
  upsertResourceItem: (payload: ResourceContentPayload) => api.put<ResourceContentItem>("/admin/resources/items", payload),
  deleteResourceItem: (key: string) => api.delete<void>(`/admin/resources/items/${key}`),
  validateLanguageFile: (cultureCode: string) => api.get<boolean>(`/admin/resources/${cultureCode}/validate`),
};

