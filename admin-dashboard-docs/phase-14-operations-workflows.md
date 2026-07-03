# Phase 14 - Operations Workflows

## Goal

Complete operational content management for languages, departments, team members, site settings, and resource content.

## Expected Output

- Language detail workflow with default/toggle/delete safeguards.
- Department translation editor using active language codes.
- Resource item editor for add/edit/delete across all resource cultures.
- Resource language validation state with direct access to invalid files/items where available.
- Site settings grouped by category with type-aware inputs.
- Team member photo/media workflow with upload, attach, and clear support.
- Better operational filters by language, status, department, category, and setting type.

## API Endpoints To Cover

- `GET /admin/languages`
- `GET /admin/languages/active-codes`
- `GET /admin/languages/default`
- `GET /admin/languages/{id}`
- `PUT /admin/languages`
- `DELETE /admin/languages/{id}`
- `PATCH /admin/languages/{id}/default`
- `PATCH /admin/languages/{id}/toggle-status`
- `GET /admin/departments`
- `PUT /admin/departments`
- `DELETE /admin/departments/{id}`
- `GET /admin/team-members`
- `PUT /admin/team-members`
- `DELETE /admin/team-members/{id}`
- `GET /admin/settings`
- `PUT /admin/settings`
- `DELETE /admin/settings/{id}`
- `GET /admin/resources/languages`
- `GET /admin/resources/{cultureCode}`
- `GET /admin/resources/items/{key}`
- `PUT /admin/resources/items`
- `DELETE /admin/resources/items/{key}`
- `GET /admin/resources/{cultureCode}/validate`

## Validation Checklist

- Cannot delete/default/toggle languages accidentally.
- Department translations can be edited per active language.
- Resource items can be edited across cultures from one form.
- Settings use type-aware controls for text, number, boolean, email, URL, and JSON.
- Team member photo path can be uploaded/updated.
- No Git commands are run by Codex.

## Verification

- Command: `npm.cmd run lint`
- Command: `npm.cmd run build`
- Manual smoke: language default/toggle, department translation edit, resource item edit, setting edit by type, team photo upload.

## Suggested Git Metadata

- Branch: `codex/phase-14-admin-operations-workflows`
- Commit: `Phase 14: complete operations workflows`
- PR title: `Phase 14: Complete operations management`

