import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import { AuthProvider } from "@/auth/AuthProvider";
import { AppLayout } from "@/components/admin/AppLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuditPage } from "@/pages/AuditPage";
import { BlogPage } from "@/pages/BlogPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { InboxPage } from "@/pages/InboxPage";
import { LoginPage } from "@/pages/LoginPage";
import { OperationsPage } from "@/pages/OperationsPage";
import { ToursPage } from "@/pages/ToursPage";
import { UsersPage } from "@/pages/UsersPage";
import "@/styles/globals.css";

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: () => (
    <>
      <ProtectedRoute />
      <AppLayout />
    </>
  ),
});

const dashboardRoute = createRoute({ getParentRoute: () => appRoute, path: "/", component: DashboardPage });
const toursRoute = createRoute({ getParentRoute: () => appRoute, path: "/tours", component: ToursPage });
const blogRoute = createRoute({ getParentRoute: () => appRoute, path: "/blog", component: BlogPage });
const inboxRoute = createRoute({ getParentRoute: () => appRoute, path: "/inbox", component: InboxPage });
const operationsRoute = createRoute({ getParentRoute: () => appRoute, path: "/operations", component: OperationsPage });
const usersRoute = createRoute({ getParentRoute: () => appRoute, path: "/users", component: UsersPage });
const auditRoute = createRoute({ getParentRoute: () => appRoute, path: "/audit", component: AuditPage });

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([dashboardRoute, toursRoute, blogRoute, inboxRoute, operationsRoute, usersRoute, auditRoute]),
]);

const router = createRouter({ routeTree });
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);