# Phase 11 - Tour Workflows

## Goal

Complete the admin tour-management experience beyond the MVP list/modal flow.

## Expected Output

- Tour detail route at `/tours/:id`.
- Detail tabs for overview, translations, gallery, itineraries, spots, and audit/context where useful.
- Tour translation editor using active language codes.
- Tour category translation editor.
- Tour image gallery using upload, add image, update metadata, main-image flag, sort order, and delete image endpoints.
- Itinerary manager using upsert/delete itinerary endpoints.
- Itinerary translation editor using active language codes.
- Spot manager using upsert/delete spot endpoints.
- Preview links for public tour detail by selected language/id or slug.

## API Endpoints To Cover

- `GET /tours`
- `GET /tours/{idOrSlug}`
- `GET /tours/categories`
- `GET /tours/categories/{idOrSlug}`
- `POST /admin/tours`
- `PUT /admin/tours/{id}`
- `DELETE /admin/tours/{id}`
- `POST /admin/tours/categories`
- `PUT /admin/tours/categories/{id}`
- `DELETE /admin/tours/categories/{id}`
- `POST /admin/tours/images`
- `PUT /admin/tours/images/{id}`
- `DELETE /admin/tours/images/{id}`
- `POST /admin/tours/itineraries`
- `DELETE /admin/tours/itineraries/{id}`
- `POST /admin/tours/spots`
- `DELETE /admin/tours/spots/{id}`
- `GET /admin/tours/{id}/translations`
- `PUT /admin/tours/{id}/translations`
- `GET /admin/tours/categories/{id}/translations`
- `PUT /admin/tours/categories/{id}/translations`
- `GET /admin/tours/itineraries/{id}/translations`
- `PUT /admin/tours/itineraries/{id}/translations`
- `POST /media/images`
- `DELETE /media/images`

## Validation Checklist

- Admin can create, edit, delete, and preview tours.
- Admin can manage all translation types from the UI.
- Admin can upload images and attach/update/delete tour gallery records.
- Admin can create/edit/delete itineraries and spots.
- Route id/request id mismatches are impossible from the UI.
- No Git commands are run by Codex.

## Verification

- Command: `npm.cmd run lint`
- Command: `npm.cmd run build`
- Manual smoke: create/edit tour, add translation, upload image, add itinerary, add spot, delete with confirmation.

## Suggested Git Metadata

- Branch: `codex/phase-11-admin-tour-workflows`
- Commit: `Phase 11: complete tour management workflows`
- PR title: `Phase 11: Complete tour management workflows`

