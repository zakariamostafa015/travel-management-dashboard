# Travel Tours Admin Dashboard

React + Vite + TypeScript admin dashboard for the Travel Tours REST API.

## Local Setup

1. Copy `.env.example` to `.env` if you need to change the API URL.
2. Start the API from `../src`.
3. Run the dashboard:

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Default API base URL:

```text
VITE_API_BASE_URL=http://localhost:5077/api/v1
```

## Implemented Workflows

- JWT login, `/auth/me` bootstrap, refresh-token retry, revoke-on-logout.
- Admin shell with responsive sidebar, role-aware navigation, dashboard metrics.
- Shared API client for the `{ success, message, data, errors, traceId }` response wrapper.
- Reusable paged server table for search, filters, sorting, paging, loading, empty, and error states.
- Tours and tour categories with create/edit/delete and image upload attachment.
- Blog posts and blog categories with create/edit/delete, publishing flags, and image upload attachment.
- Bookings and contact inquiries with status/admin-note updates.
- Operations: languages, departments, team members, site settings, resource language validation.
- Users: create/edit/delete/reactivate/password reset.
- Audit logs with filters and trace-id visibility.

## Verification

```powershell
npm.cmd run lint
npm.cmd run build
```

Current lint has warnings only for TanStack Table's React Compiler compatibility notice and auth provider Fast Refresh colocation.