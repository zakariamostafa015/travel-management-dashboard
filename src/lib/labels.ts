import type { BookingStatus, InquiryStatus, SettingType, UserRole } from "@/types/api";

export const roleLabels: Record<UserRole, string> = {
  0: "Admin",
  1: "Editor",
  2: "Author",
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  0: "New",
  1: "In progress",
  2: "Responded",
  3: "Closed",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  0: "Pending",
  1: "Confirmed",
  2: "In progress",
  3: "Completed",
  4: "Cancelled",
};

export const settingTypeLabels: Record<SettingType, string> = {
  0: "Text",
  1: "Number",
  2: "Boolean",
  3: "Email",
  4: "URL",
  5: "JSON",
};

export function booleanLabel(value: boolean) {
  return value ? "Yes" : "No";
}

export function isAdmin(role?: UserRole | null) {
  return role === 0;
}

export function isContentManager(role?: UserRole | null) {
  return role === 0 || role === 1;
}
