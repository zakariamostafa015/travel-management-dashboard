import { api } from "@/lib/api";
import type { PagedQuery, PagedResult, TourCategory, TourDetails, TourSummary } from "@/types/api";

export type TourListQuery = PagedQuery & {
  language?: string;
  categoryId?: number | string;
  isActive?: boolean | string;
  isFeatured?: boolean | string;
  isPackage?: boolean | string;
};

export type TourPayload = {
  id?: number;
  price: number | null;
  duration: number;
  durationText: string | null;
  isPackage: boolean;
  categoryId: number;
  featuredImagePath: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  translations: Array<{
    language: string;
    title: string;
    shortDescription: string;
    description: string;
    slug: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    durationUnit: string | null;
    activityHighlights: string | null;
  }>;
};

export type TourCategoryPayload = {
  id?: number;
  iconClass: string | null;
  isActive: boolean;
  sortOrder: number;
  translations: Array<{
    language: string;
    name: string;
    description: string | null;
    slug: string | null;
  }>;
};

export const toursClient = {
  listTours: (query: TourListQuery = {}) => api.get<PagedResult<TourSummary>>("/tours", query),
  getTour: (idOrSlug: number | string, language = "en") => api.get<TourDetails>(`/tours/${idOrSlug}`, { language }),
  listCategories: (query: TourListQuery = {}) => api.get<PagedResult<TourCategory>>("/tours/categories", query),
  getCategory: (idOrSlug: number | string, language = "en") => api.get<TourCategory>(`/tours/categories/${idOrSlug}`, { language }),
  createTour: (payload: TourPayload) => api.post<TourDetails>("/admin/tours", payload),
  updateTour: (id: number, payload: TourPayload) => api.put<TourDetails>(`/admin/tours/${id}`, payload),
  deleteTour: (id: number) => api.delete<void>(`/admin/tours/${id}`),
  createCategory: (payload: TourCategoryPayload) => api.post<TourCategory>("/admin/tours/categories", payload),
  updateCategory: (id: number, payload: TourCategoryPayload) => api.put<TourCategory>(`/admin/tours/categories/${id}`, payload),
  deleteCategory: (id: number) => api.delete<void>(`/admin/tours/categories/${id}`),
};

