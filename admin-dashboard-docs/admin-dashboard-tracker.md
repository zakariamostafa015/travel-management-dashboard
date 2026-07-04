# Admin Dashboard Tracker

Last updated: 2026-07-03

## Resume Instructions

Start every new context by reading this file and `admin-dashboard-docs/admin-dashboard-plan.md`.

Current stop point: Phase 10 is complete. Stop here until the user reviews the changes and asks to begin Phase 11.

Next phase to start only after the user asks to continue: Phase 11 - Tour workflows.

Codex rule: do not run Git commands. The user handles branch creation, commits, pushes, and PRs.

## Phase Status

| Phase | Name | Status | Completed On | Notes |
|---:|---|---|---|---|
| MVP | Foundation dashboard | Done | 2026-07-03 | Built React + Vite + TypeScript MVP with auth, API wrapper, responsive shell, dashboard metrics, reusable server table, tours/blog/inbox/operations/users/audit initial workflows, media upload, `.gitignore`, `.env.example`, and README. |
| 10 | API client hardening | Done | 2026-07-03 | Added typed feature clients, query key factory, route helpers, API error helpers, mutation helpers, API error renderer, confirmation action button, React Hook Form field helpers, and refactored MVP pages away from raw endpoint strings. |
| 11 | Tour workflows | Next |  | Add tour detail route, translations, gallery, itineraries, spots, category translations, and preview support. |
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

## Phase 10 Checklist

- [x] Create typed feature API client modules.
- [x] Create query key factory.
- [x] Create shared mutation helpers.
- [x] Create shared API error renderer.
- [x] Create reusable confirmation wrapper for destructive/status actions.
- [x] Create reusable form field/error components for React Hook Form.
- [x] Update existing pages to use the new client/helper layer.
- [x] Run lint/build verification.
- [x] Update this tracker.

## Phase 10 Verification

- Command: `npm.cmd run lint`
- Result: passed with warnings only.
- Warnings:
  - Auth provider Fast Refresh colocation warning.
  - TanStack Table React Compiler compatibility warning.

- Command: `npm.cmd run build`
- Result: build succeeded.
- Note: Vite reported a non-blocking chunk size warning for the main bundle.

## Next Phase Checklist

Phase 11 can begin when the user says to continue.

- [ ] Add tour detail route at `/tours/:id`.
- [ ] Add tour overview/detail layout.
- [ ] Add tour translation editor using active language codes.
- [ ] Add tour category translation editor.
- [ ] Add tour gallery manager for image records and metadata.
- [ ] Add itinerary manager.
- [ ] Add itinerary translation editor.
- [ ] Add spot manager.
- [ ] Add preview support by selected language.
- [ ] Run lint/build verification.
- [ ] Update this tracker.