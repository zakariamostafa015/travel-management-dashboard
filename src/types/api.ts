export type SortDirection = 0 | 1;
export type UserRole = 0 | 1 | 2;
export type InquiryStatus = 0 | 1 | 2 | 3;
export type BookingStatus = 0 | 1 | 2 | 3 | 4;
export type SettingType = 0 | 1 | 2 | 3 | 4 | 5;

export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
};

export type PagedResult<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PagedQuery = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
};

export type AuthTokenResponse = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
  user: AuthenticatedUser;
};

export type Language = {
  id: number;
  code: string;
  cultureCode: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type TourSummary = {
  id: number;
  title: string;
  slug?: string | null;
  shortDescription: string;
  price?: number | null;
  duration: number;
  durationText?: string | null;
  isPackage: boolean;
  featuredImagePath?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  categoryId: number;
  categoryName?: string | null;
};

export type TourDetails = TourSummary & {
  description: string;
  durationUnit?: string | null;
  activityHighlights?: string | null;
  createdDate: string;
  updatedDate?: string | null;
  category?: TourCategory | null;
  images: TourImage[];
  itineraries: TourItinerary[];
  spots: TourSpot[];
};

export type TourCategory = {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
  iconClass?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type TourImage = {
  id: number;
  imagePath: string;
  imageUrl?: string | null;
  imageLocalPath?: string | null;
  thumbnailPath?: string | null;
  mediumPath?: string | null;
  altText?: string | null;
  caption?: string | null;
  sortOrder: number;
  isMainImage: boolean;
};

export type TourItinerary = {
  id: number;
  day: number;
  sortOrder: number;
  title: string;
  description: string;
  location?: string | null;
  accommodation?: string | null;
  meals?: string | null;
};

export type TourSpot = {
  id: number;
  latitude: number;
  longitude: number;
  order: number;
  name?: string | null;
  description?: string | null;
};

export type BlogPostSummary = {
  id: number;
  title: string;
  slug?: string | null;
  excerpt: string;
  featuredImagePath?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  isEvent: boolean;
  publishedDate?: string | null;
  viewCount: number;
  categoryId: number;
  categoryName?: string | null;
  authorId: number;
  authorName?: string | null;
};

export type BlogPostDetails = BlogPostSummary & {
  content: string;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  createdDate: string;
  updatedDate?: string | null;
  category?: BlogCategory | null;
  images: BlogImage[];
};

export type BlogCategory = {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
  iconClass?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type BlogImage = Omit<TourImage, "isMainImage">;

export type ContactInquiry = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdDate: string;
  respondedDate?: string | null;
  adminNotes?: string | null;
};

export type BookingRequest = {
  id: number;
  tourId: number;
  tourTitle?: string | null;
  name: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
  preferredTravelDate: string;
  specialRequests?: string | null;
  status: BookingStatus;
  createdDate: string;
  processedDate?: string | null;
  adminNotes?: string | null;
  estimatedTotal?: number | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  profileImagePath?: string | null;
  role: UserRole;
  isActive: boolean;
  emailConfirmed: boolean;
  createdDate: string;
  lastLoginDate?: string | null;
};

export type Department = {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdDate: string;
  updatedDate?: string | null;
};

export type TeamMember = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  departmentId?: number | null;
  departmentName?: string | null;
  email: string;
  bio?: string | null;
  photoPath?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type SiteSetting = {
  id: number;
  key: string;
  value?: string | null;
  description?: string | null;
  category?: string | null;
  iconClass?: string | null;
  sortOrder: number;
  type: SettingType;
  isActive: boolean;
};

export type ResourceContentLanguage = {
  cultureCode: string;
  isValid: boolean;
};

export type ResourceContentItem = {
  key: string;
  category: string;
  translations: Record<string, string>;
};

export type AuditLog = {
  id: number;
  userId?: number | null;
  username?: string | null;
  httpMethod: string;
  path: string;
  queryString?: string | null;
  area?: string | null;
  action?: string | null;
  statusCode: number;
  succeeded: boolean;
  elapsedMilliseconds: number;
  ipAddress?: string | null;
  userAgent?: string | null;
  traceId?: string | null;
  createdAtUtc: string;
};

export type MediaAsset = {
  imagePath: string;
  imageUrl?: string | null;
  imageLocalPath?: string | null;
  thumbnailPath?: string | null;
  mediumPath?: string | null;
  altText?: string | null;
  caption?: string | null;
};
