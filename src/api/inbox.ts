import { api } from "@/lib/api";
import type { BookingRequest, BookingStatus, ContactInquiry, InquiryStatus, PagedQuery, PagedResult } from "@/types/api";

export type InquiryQuery = PagedQuery & {
  status?: InquiryStatus | string;
  createdFrom?: string;
  createdTo?: string;
};

export type BookingQuery = PagedQuery & {
  status?: BookingStatus | string;
  tourId?: number | string;
  createdFrom?: string;
  createdTo?: string;
};

export type InquiryStatusPayload = {
  id: number;
  status: InquiryStatus;
  adminNotes: string | null;
};

export type BookingStatusPayload = {
  id: number;
  status: BookingStatus;
  adminNotes: string | null;
};

export const inboxClient = {
  listInquiries: (query: InquiryQuery = {}) => api.get<PagedResult<ContactInquiry>>("/contact/inquiries", query),
  getInquiry: (id: number) => api.get<ContactInquiry>(`/contact/inquiries/${id}`),
  updateInquiryStatus: (id: number, payload: InquiryStatusPayload) =>
    api.patch<ContactInquiry>(`/contact/inquiries/${id}/status`, payload),
  deleteInquiry: (id: number) => api.delete<void>(`/contact/inquiries/${id}`),
  listBookings: (query: BookingQuery = {}) => api.get<PagedResult<BookingRequest>>("/contact/bookings", query),
  getBooking: (id: number) => api.get<BookingRequest>(`/contact/bookings/${id}`),
  updateBookingStatus: (id: number, payload: BookingStatusPayload) =>
    api.patch<BookingRequest>(`/contact/bookings/${id}/status`, payload),
  deleteBooking: (id: number) => api.delete<void>(`/contact/bookings/${id}`),
};

