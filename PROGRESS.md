# Development Progress Log

Keep this updated as you go — it's useful evidence of process for your thesis
defense, and helps you remember what you did and why.

## [Date] — Initial prototype
- Built HTML/JS frontend with mock/local data to validate the UI and data
  model concept.

## [Date] — Backend built
- Set up FastAPI + SQLModel + SQLite backend.
- Defined the Fabric data model (name, SKU, category, composition, color,
  weight, width, price, stock, supplier, season, usage, care instructions).
- Implemented CRUD endpoints: list/filter, get one, create, update, delete.
- Added a seed script for sample data.

## [Date] — Connected frontend to backend
- Replaced local browser storage with real fetch() calls to the API.
- Verified full create/edit/delete loop works end-to-end through the UI.

## [Date] — Next
- (fill in as you go: auth, image upload, deployment, testing, etc.)
