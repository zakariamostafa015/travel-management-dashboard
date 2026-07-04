import { api } from "@/lib/api";
import type { BlogPostSummary, SettingType, TourCategory, TourSummary } from "@/types/api";

export type PublicSiteSetting = {
  key: string;
  value?: string | null;
  description?: string | null;
  category?: string | null;
  iconClass?: string | null;
  sortOrder: number;
  type: SettingType;
};

export type HomeContent = {
  featuredTours: TourSummary[];
  featuredBlogPosts: BlogPostSummary[];
  featuredEvents: BlogPostSummary[];
  tourCategories: TourCategory[];
  siteSettings: PublicSiteSetting[];
};

export const publicContentClient = {
  getHome: (language = "en") => api.get<HomeContent>("/home", { language }),
  listSettings: (category?: string) => api.get<PublicSiteSetting[]>("/content/settings", { category }),
  getSetting: (key: string) => api.get<PublicSiteSetting>(`/content/settings/${key}`),
};

