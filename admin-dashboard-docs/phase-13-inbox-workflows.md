# Phase 13 - Inbox Workflows

## Goal

Complete booking request and contact inquiry workflows for operational staff.

## Expected Output

- Booking detail route at `/inbox/bookings/:id`.
- Inquiry detail route at `/inbox/inquiries/:id`.
- Detail views with customer data, message/request data, status, notes, dates, and traceable actions.
- Delete flows for bookings and inquiries with confirmation.
- Rich filters for status, tour, created date range, and search.
- Quick status actions for common transitions.
- Clear handling for email/phone/customer metadata.

## API Endpoints To Cover

- `GET /contact/inquiries`
- `GET /contact/inquiries/{id}`
- `PATCH /contact/inquiries/{id}/status`
- `DELETE /contact/inquiries/{id}`
- `GET /contact/bookings`
- `GET /contact/bookings/{id}`
- `PATCH /contact/bookings/{id}/status`
- `DELETE /contact/bookings/{id}`
- Supporting `GET /tours` for booking tour filters.

## Validation Checklist

- Admin can inspect full booking and inquiry details.
- Admin can update statuses with notes.
- Admin can delete records only after confirmation.
- Date filters send valid API query params.
- Tour filters use real tour ids.
- No Git commands are run by Codex.

## Verification

- Command: `npm.cmd run lint`
- Command: `npm.cmd run build`
- Manual smoke: filter bookings, open detail, update status, filter inquiries, update notes, delete with confirmation.

## Suggested Git Metadata

- Branch: `codex/phase-13-admin-inbox-workflows`
- Commit: `Phase 13: complete inbox workflows`
- PR title: `Phase 13: Complete booking and inquiry workflows`

