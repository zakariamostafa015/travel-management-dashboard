import type { PagedQuery } from "@/types/api";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  dashboard: {
    count: (name: string, query?: Record<string, unknown>) => ["dashboard", "count", name, query] as const,
    recentBookings: ["dashboard", "recent-bookings"] as const,
  },
  tours: {
    lists: ["tours"] as const,
    list: (query: PagedQuery & Record<string, unknown>) => ["tours", "list", query] as const,
    details: (id: number | null) => ["tours", "details", id] as const,
    categories: (query?: PagedQuery & Record<string, unknown>) => ["tours", "categories", query] as const,
    categorySelect: ["tours", "categories", "select"] as const,
  },
  blog: {
    lists: ["blog"] as const,
    list: (query: PagedQuery & Record<string, unknown>) => ["blog", "list", query] as const,
    details: (id: number | null) => ["blog", "details", id] as const,
    categories: (query?: PagedQuery & Record<string, unknown>) => ["blog", "categories", query] as const,
    categorySelect: ["blog", "categories", "select"] as const,
  },
  inbox: {
    bookings: (query?: PagedQuery & Record<string, unknown>) => ["inbox", "bookings", query] as const,
    inquiries: (query?: PagedQuery & Record<string, unknown>) => ["inbox", "inquiries", query] as const,
  },
  operations: {
    languages: (query?: PagedQuery & Record<string, unknown>) => ["operations", "languages", query] as const,
    departments: (query?: PagedQuery & Record<string, unknown>) => ["operations", "departments", query] as const,
    departmentSelect: ["operations", "departments", "select"] as const,
    teamMembers: (query?: PagedQuery & Record<string, unknown>) => ["operations", "team-members", query] as const,
    settings: (query?: PagedQuery & Record<string, unknown>) => ["operations", "settings", query] as const,
    resourceLanguages: ["operations", "resources", "languages"] as const,
  },
  users: {
    list: (query?: PagedQuery & Record<string, unknown>) => ["users", "list", query] as const,
  },
  audit: {
    list: (query?: PagedQuery & Record<string, unknown>) => ["audit", "list", query] as const,
  },
};

export type QueryKeyFactory = typeof queryKeys;

