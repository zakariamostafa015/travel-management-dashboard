# Phase 10 - API Client Hardening

## Goal

Replace scattered page-level API calls with a typed feature-client layer and shared workflow utilities.

## Expected Output

- Feature API modules for auth, tours, blog, inbox/contact, operations, users, audit, media, and public content.
- Query key factory for stable TanStack Query keys.
- Shared mutation helpers for success/error toast behavior and query invalidation.
- Shared API error renderer that can show message, field errors, and `traceId`.
- Shared confirmation utility for destructive and status-changing actions.
- Shared form field/error components for React Hook Form and Zod.
- Existing MVP pages still work after moving to the new client/helper layer.

## Validation Checklist

- No endpoint string duplication remains in page components where a feature client exists.
- Existing auth refresh/retry behavior still works.
- Existing table search, filters, sorting, and paging still work.
- API validation errors can be displayed near fields for new forms.
- Destructive/status actions use a confirmation flow.
- No Git commands are run by Codex.

## Verification

- Command: `npm.cmd run lint`
- Command: `npm.cmd run build`
- Manual smoke: login, dashboard metrics, tours list, blog list, inbox list, operations list, users list, audit list.

## Suggested Git Metadata

- Branch: `codex/phase-10-admin-api-clients`
- Commit: `Phase 10: add typed admin API clients`
- PR title: `Phase 10: Complete admin API client coverage`

