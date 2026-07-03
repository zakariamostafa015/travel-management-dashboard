# Phase 12 - Blog Workflows

## Goal

Complete the admin blog/event-management experience beyond the MVP list/modal flow.

## Expected Output

- Blog detail route at `/blog/:id`.
- Detail tabs for overview, translations, gallery, publishing, and category context.
- Blog post translation editor using active language codes.
- Blog category translation editor.
- Blog image gallery using upload, add image, update metadata, sort order, and delete image endpoints.
- Publishing controls for published/draft, featured, event, and published date.
- Author selection or author id validation using available user data.
- Preview links for public blog detail by selected language/id or slug.

## API Endpoints To Cover

- `GET /blog`
- `GET /blog/{idOrSlug}`
- `GET /blog/categories`
- `GET /blog/categories/{idOrSlug}`
- `POST /admin/blog`
- `PUT /admin/blog/{id}`
- `DELETE /admin/blog/{id}`
- `POST /admin/blog/categories`
- `PUT /admin/blog/categories/{id}`
- `DELETE /admin/blog/categories/{id}`
- `POST /admin/blog/images`
- `PUT /admin/blog/images/{id}`
- `DELETE /admin/blog/images/{id}`
- `GET /admin/blog/{id}/translations`
- `PUT /admin/blog/{id}/translations`
- `GET /admin/blog/categories/{id}/translations`
- `PUT /admin/blog/categories/{id}/translations`
- `POST /admin/blog/{id}/view-count`
- `POST /media/images`
- `DELETE /media/images`

## Validation Checklist

- Admin can create, edit, delete, and preview blog posts/events.
- Admin can manage post and category translations.
- Admin can upload images and attach/update/delete blog gallery records.
- Publishing state is clear and cannot be accidentally changed without saving.
- Event posts are visually distinguished from normal posts.
- No Git commands are run by Codex.

## Verification

- Command: `npm.cmd run lint`
- Command: `npm.cmd run build`
- Manual smoke: create/edit post, toggle publishing flags, add translation, upload image, delete with confirmation.

## Suggested Git Metadata

- Branch: `codex/phase-12-admin-blog-workflows`
- Commit: `Phase 12: complete blog management workflows`
- PR title: `Phase 12: Complete blog management workflows`

