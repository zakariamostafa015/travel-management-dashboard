import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "muted" | "dark";

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  success: "bg-[#5db872]/15 text-[#2f7f45] ring-[#5db872]/25",
  warning: "bg-[#e8a55a]/18 text-[#8a5b11] ring-[#e8a55a]/30",
  danger: "bg-destructive/12 text-destructive ring-destructive/20",
  muted: "bg-secondary text-muted-foreground ring-border",
  dark: "bg-[#181715] text-[#faf9f5]",
};

export function Badge({
  className,
  variant = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
