import { Badge } from "@/components/ui/badge";
import { bookingStatusLabels, inquiryStatusLabels, roleLabels, settingTypeLabels } from "@/lib/labels";
import type { BookingStatus, InquiryStatus, SettingType, UserRole } from "@/types/api";

export function StatusBadge({ active, trueLabel = "Active", falseLabel = "Inactive" }: { active: boolean; trueLabel?: string; falseLabel?: string }) {
  return <Badge variant={active ? "success" : "muted"}>{active ? trueLabel : falseLabel}</Badge>;
}

export function FeaturedBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? "default" : "muted"}>{active ? "Featured" : "Standard"}</Badge>;
}

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant={role === 0 ? "dark" : role === 1 ? "default" : "muted"}>{roleLabels[role]}</Badge>;
}

export function InquiryBadge({ status }: { status: InquiryStatus }) {
  const variant = status === 0 ? "warning" : status === 1 ? "default" : status === 2 ? "success" : "muted";
  return <Badge variant={variant}>{inquiryStatusLabels[status]}</Badge>;
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  const variant = status === 0 ? "warning" : status === 1 ? "default" : status === 2 ? "default" : status === 3 ? "success" : "danger";
  return <Badge variant={variant}>{bookingStatusLabels[status]}</Badge>;
}

export function SettingTypeBadge({ type }: { type: SettingType }) {
  return <Badge variant="muted">{settingTypeLabels[type]}</Badge>;
}