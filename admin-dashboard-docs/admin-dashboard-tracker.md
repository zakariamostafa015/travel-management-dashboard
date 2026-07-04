# Admin Dashboard Tracker

Last updated: 2026-07-03

## Resume Instructions

Start every new context by reading this file and `admin-dashboard-docs/admin-dashboard-plan.md`.

Current stop point: MVP/Foundation is complete. Stop here until the user asks to begin Phase 10.

Next phase to start only after the user asks to continue: Phase 10 - API client hardening.

Codex rule: do not run Git commands. The user handles branch creation, commits, pushes, and PRs.

## Phase Status

| Phase | Name | Status | Completed On | Notes |
|---:|---|---|---|---|
| MVP | Foundation dashboard | Done | 2026-07-03 | Built React + Vite + TypeScript MVP with auth, API wrapper, responsive shell, dashboard metrics, reusable server table, tours/blog/inbox/operations/users/audit initial workflows, media upload, `.gitignore`, `.env.example`, and README. |
| 10 | API client hardening | Next |  | Add typed feature clients, query keys, shared mutation/error helpers, reusable confirmation/form utilities, and route helpers. |
| 11 | Tour workflows | Not Started |  | Add tour detail route, translations, gallery, itineraries, spots, category translations, and preview support. |
| 12 | Blog workflows | Not Started |  | Add blog detail route, translations, gallery, category translations, publishing controls, event controls, and preview support. |
| 13 | Inbox workflows | Not Started |  | Add booking/inquiry detail routes, delete flows, richer filters, status actions, and clearer notes workflow. |
| 14 | Operations workflows | Not Started |  | Add resource item editor, department translations, settings grouping, language safeguards, and team media improvements. |
| 15 | Users and audit depth | Not Started |  | Add user detail, username lookup, change/reset password UX, audit detail, and richer audit filters. |
| 16 | Hardening | Not Started |  | Add accessibility pass, RTL pass, responsive QA, docs cleanup, and final build/lint verification. |

## MVP Verification

- Command: `npm.cmd run lint`
- Result: passed with warnings only.
- Warnings:
  - Auth provider Fast Refresh colocation warning.
  - TanStack Table React Compiler compatibility warning.

- Command: `npm.cmd run build`
- Result: build succeeded.

- Dev server:
  - URL: `http://127.0.0.1:5173`
  - Result: served successfully with HTTP 200.

## MVP Implemented Workflows

- JWT login.
- `/auth/me` session bootstrap.
- Access-token attachment and refresh-token retry.
- Revoke-on-logout.
- Role-aware sidebar navigation.
- Dashboard API connectivity metrics.
- Tours and tour categories create/edit/delete.
- Blog posts and categories create/edit/delete.
- Contact inquiries and booking requests status updates.
- Languages, departments, team members, site settings, resource language validation.
- Users create/edit/delete/reactivate/password reset.
- Audit log table.
- Media upload attachment for tours, blog, team, and users.

## Next Phase Checklist

Phase 10 can begin when the user says to continue.

- [ ] Create typed feature API client modules.
- [ ] Create query key factory.
- [ ] Create shared mutation helpers.
- [ ] Create shared API error renderer.
- [ ] Create reusable confirmation wrapper for destructive/status actions.
- [ ] Create reusable form field/error components for React Hook Form.
- [ ] Update existing pages to use the new client/helper layer.
- [ ] Run lint/build verification.
- [ ] Update this tracker.

