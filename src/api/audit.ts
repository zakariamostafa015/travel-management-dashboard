import { api } from "@/lib/api";
import type { AuditLog, PagedQuery, PagedResult } from "@/types/api";

export type AuditLogQuery = PagedQuery & {
  userId?: number | string;
  httpMethod?: string;
  area?: string;
  statusCode?: number | string;
  succeeded?: boolean | string;
  createdFromUtc?: string;
  createdToUtc?: string;
};

export const auditClient = {
  listAuditLogs: (query: AuditLogQuery = {}) => api.get<PagedResult<AuditLog>>("/admin/audit-logs", query),
  getAuditLog: (id: number) => api.get<AuditLog>(`/admin/audit-logs/${id}`),
};

