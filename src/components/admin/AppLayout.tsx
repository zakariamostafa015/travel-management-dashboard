import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Globe2,
  Languages,
  LogOut,
  Menu,
  Plane,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { useAuth } from "@/auth/AuthProvider";
import { isAdmin, isContentManager, roleLabels } from "@/lib/labels";
import type { UserRole } from "@/types/api";
import { cn } from "@/lib/utils";

const navItems: { to: string; label: string; icon: typeof BarChart3; roles: UserRole[] }[] = [
  { to: "/", label: "Dashboard", icon: BarChart3, roles: [0, 1, 2] },
  { to: "/tours", label: "Tours", icon: Plane, roles: [0, 1] },
  { to: "/blog", label: "Blog", icon: BookOpen, roles: [0, 1] },
  { to: "/inbox", label: "Inbox", icon: ClipboardList, roles: [0] },
  { to: "/operations", label: "Operations", icon: Languages, roles: [0] },
  { to: "/users", label: "Users", icon: Users, roles: [0] },
  { to: "/audit", label: "Audit", icon: ShieldCheck, roles: [0] },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const visibleItems = useMemo(() => navItems.filter((item) => user && item.roles.includes(user.role)), [user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#2f2d29] bg-[#181715] text-[#faf9f5] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#2f2d29] px-5">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Globe2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">Via Arabia</span>
              <span className="block text-xs text-[#a09d96]">Travel Tours Admin</span>
            </span>
          </Link>
          <Button type="button" variant="ghost" size="icon" className="text-[#faf9f5] lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="admin-scrollbar flex-1 overflow-y-auto px-3 py-4">
          {visibleItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#d7d1c8] transition-colors hover:bg-[#252320] hover:text-[#faf9f5]",
                  active && "bg-[#252320] text-[#faf9f5]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#2f2d29] p-4">
          <div className="rounded-md bg-[#252320] p-3">
            <p className="text-sm font-medium">{user?.firstName || user?.username}</p>
            <p className="mt-1 text-xs text-[#a09d96]">{user ? roleLabels[user.role] : ""}</p>
          </div>
          <Button type="button" variant="ghost" className="mt-3 w-full justify-start text-[#faf9f5]" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {open ? <button type="button" className="fixed inset-0 z-30 bg-[#181715]/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" /> : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-6">
          <Button type="button" variant="secondary" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative max-w-lg flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search the current table on each page" className="pl-9" aria-label="Search hint" disabled />
          </div>
          <div className="hidden text-right text-sm sm:block">
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">
              {isAdmin(user?.role) ? "Full access" : isContentManager(user?.role) ? "Content access" : "Author access"}
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}