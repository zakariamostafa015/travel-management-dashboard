# Admin Dashboard Completion Plan

## Summary

Complete the TravelToursWebsite admin dashboard from the current MVP into a full admin application that covers the existing REST API surface.

The MVP already includes:

- React + Vite + TypeScript setup.
- JWT login, refresh retry, `/auth/me` bootstrap, and revoke-on-logout.
- Responsive admin shell with role-aware navigation.
- Shared API client for the `{ success, message, data, errors, traceId }` response wrapper.
- Reusable paged server table.
- Initial workflows for tours, blog, inbox, operations, users, audit, and media upload.

The remaining work is depth and full endpoint coverage: translations, galleries, detail routes, tour itineraries/spots, resource item editing, richer filters, confirmation flows, and hardening.

## API Coverage Goals

Cover every existing API endpoint exposed by:

- `AuthController`
- `ToursController`
- `BlogController`
- `ContactController`
- `MediaController`
- `PublicContentController`
- `AdminToursController`
- `AdminBlogController`
- `AdminOperationsController`
- `AdminUsersController`
- `AdminAuditLogsController`

Avoid API changes unless the current API makes an admin workflow impossible.

## Phase Roadmap

| Phase | Name | Goal | Manual Git Metadata |
|---:|---|---|---|
| MVP | Foundation dashboard | Existing MVP dashboard shell and initial workflows | Already completed by user-managed Git |
| 10 | API client hardening | Add typed feature clients, query keys, shared mutation/error helpers, and reusable form utilities | Branch: `codex/phase-10-admin-api-clients`; Commit: `Phase 10: add typed admin API clients`; PR: `Phase 10: Complete admin API client coverage` |
| 11 | Tour workflows | Complete tour detail, translations, gallery, itineraries, spots, and category translation workflows | Branch: `codex/phase-11-admin-tour-workflows`; Commit: `Phase 11: complete tour management workflows`; PR: `Phase 11: Complete tour management workflows` |
| 12 | Blog workflows | Complete blog detail, translations, gallery, category translations, publishing and event controls | Branch: `codex/phase-12-admin-blog-workflows`; Commit: `Phase 12: complete blog management workflows`; PR: `Phase 12: Complete blog management workflows` |
| 13 | Inbox workflows | Complete booking and inquiry detail, delete, status, notes, and richer filters | Branch: `codex/phase-13-admin-inbox-workflows`; Commit: `Phase 13: complete inbox workflows`; PR: `Phase 13: Complete booking and inquiry workflows` |
| 14 | Operations workflows | Complete resource item editing, department translations, settings grouping, and language safeguards | Branch: `codex/phase-14-admin-operations-workflows`; Commit: `Phase 14: complete operations workflows`; PR: `Phase 14: Complete operations management` |
| 15 | Users and audit depth | Complete user detail, username lookup, password flows, audit detail, and richer audit filters | Branch: `codex/phase-15-admin-users-audit-depth`; Commit: `Phase 15: complete users and audit workflows`; PR: `Phase 15: Complete users and audit administration` |
| 16 | Hardening | Accessibility, RTL, responsive QA, docs cleanup, and final build/lint verification | Branch: `codex/phase-16-admin-hardening`; Commit: `Phase 16: harden full admin dashboard`; PR: `Phase 16: Harden full admin dashboard` |

## Cross-Cutting Standards

- Use typed feature clients instead of page-local endpoint strings for new work.
- Preserve numeric enum values because the API currently returns numeric enums.
- Use active language codes from `/api/v1/admin/languages/active-codes` for multilingual editors.
- Show API `traceId` in error states where useful.
- Confirm every destructive or status-changing action.
- Use Zod and React Hook Form for new complex forms.
- Keep UI consistent with `DESIGN.md`: warm canvas, coral primary actions, dark operational shell, compact admin density.
- Do not add Git automation. The user handles Git.

## Completion Definition

The dashboard is complete when:

- Every existing admin/public support endpoint has a visible workflow or documented reason it is intentionally not exposed.
- Admin, Editor, and Author role access behaves correctly.
- Multilingual content can be created and edited for tours, tour categories, itineraries, blog posts, blog categories, and departments.
- Media gallery workflows support upload, attach, update metadata, and delete where the API supports it.
- `npm.cmd run lint` and `npm.cmd run build` pass.

