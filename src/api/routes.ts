export const adminRoutes = {
  dashboard: () => "/",
  login: () => "/login",
  tours: () => "/tours",
  tourDetail: (id: number) => `/tours/${id}`,
  blog: () => "/blog",
  blogDetail: (id: number) => `/blog/${id}`,
  inbox: () => "/inbox",
  bookingDetail: (id: number) => `/inbox/bookings/${id}`,
  inquiryDetail: (id: number) => `/inbox/inquiries/${id}`,
  operations: () => "/operations",
  users: () => "/users",
  userDetail: (id: number) => `/users/${id}`,
  audit: () => "/audit",
  auditDetail: (id: number) => `/audit/${id}`,
};

