import { api } from "@/lib/api";
import type { BlogCategory, BlogPostDetails, BlogPostSummary, PagedQuery, PagedResult } from "@/types/api";

export type BlogPostQuery = PagedQuery & {
  language?: string;
  categoryId?: number | string;
  isPublished?: boolean | string;
  isFeatured?: boolean | string;
  isEvent?: boolean | string;
};

export type BlogPostPayload = {
  id?: number;
  featuredImagePath: string | null;
  categoryId: number;
  authorId: number;
  isPublished: boolean;
  isFeatured: boolean;
  isEvent: boolean;
  publishedDate: string | null;
  translations: Array<{
    language: string;
    title: string;
    excerpt: string;
    content: string;
    slug: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
  }>;
};

export type BlogCategoryPayload = {
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

export const blogClient = {
  listPosts: (query: BlogPostQuery = {}) => api.get<PagedResult<BlogPostSummary>>("/blog", query),
  getPost: (idOrSlug: number | string, language = "en") => api.get<BlogPostDetails>(`/blog/${idOrSlug}`, { language }),
  listCategories: (query: BlogPostQuery = {}) => api.get<PagedResult<BlogCategory>>("/blog/categories", query),
  getCategory: (idOrSlug: number | string, language = "en") => api.get<BlogCategory>(`/blog/categories/${idOrSlug}`, { language }),
  createPost: (payload: BlogPostPayload) => api.post<BlogPostDetails>("/admin/blog", payload),
  updatePost: (id: number, payload: BlogPostPayload) => api.put<BlogPostDetails>(`/admin/blog/${id}`, payload),
  deletePost: (id: number) => api.delete<void>(`/admin/blog/${id}`),
  createCategory: (payload: BlogCategoryPayload) => api.post<BlogCategory>("/admin/blog/categories", payload),
  updateCategory: (id: number, payload: BlogCategoryPayload) => api.put<BlogCategory>(`/admin/blog/categories/${id}`, payload),
  deleteCategory: (id: number) => api.delete<void>(`/admin/blog/categories/${id}`),
};

