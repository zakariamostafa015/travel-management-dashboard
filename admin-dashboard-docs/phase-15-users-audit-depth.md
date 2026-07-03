# Phase 15 - Users and Audit Depth

## Goal

Complete user administration and audit log inspection workflows.

## Expected Output

- User detail route at `/users/:id`.
- Username lookup support using `/admin/users/by-username/{username}`.
- User detail sections for profile, permissions, account state, and password actions.
- Current-password change flow where appropriate.
- Reset password, reactivate, delete, and edit actions with confirmations.
- Audit detail route or drawer using `/admin/audit-logs/{id}`.
- Audit filters for user id, method, area, status code, success state, and created date range.
- Trace id display and copy support.

## API Endpoints To Cover

- `GET /admin/users`
- `GET /admin/users/{id}`
- `GET /admin/users/by-username/{username}`
- `POST /admin/users`
- `PUT /admin/users/{id}`
- `PATCH /admin/users/{id}/password`
- `PATCH /admin/users/{id}/password/reset`
- `DELETE /admin/users/{id}`
- `PATCH /admin/users/{id}/reactivate`
- `GET /admin/audit-logs`
- `GET /admin/audit-logs/{id}`

## Validation Checklist

- Admin can inspect a user before editing.
- Username lookup has clear found/not-found states.
- Password forms enforce minimum length before submit.
- Role changes are explicit and visible.
- Audit detail shows method, path, query string, status, elapsed time, user, user agent, IP, and trace id.
- No Git commands are run by Codex.

## Verification

- Command: `npm.cmd run lint`
- Command: `npm.cmd run build`
- Manual smoke: create user, edit user, reset password, reactivate inactive user, filter audit logs, open audit detail.

## Suggested Git Metadata

- Branch: `codex/phase-15-admin-users-audit-depth`
- Commit: `Phase 15: complete users and audit workflows`
- PR title: `Phase 15: Complete users and audit administration`

