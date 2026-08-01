# Development Progress Log

Keep this updated as you go — it's useful evidence of process for your thesis
defense, and helps you remember what you did and why.

## Initial prototype
- Built HTML/JS frontend with mock/local data to validate the UI and data
  model concept.
- Set up FastAPI + SQLModel + SQLite backend.
- Defined the Fabric data model (name, SKU, category, composition, color,
  weight, width, price, stock, supplier, season, usage, care instructions).
- Implemented CRUD endpoints: list/filter, get one, create, update, delete.
- Added a seed script for sample data.
- Added environment config and database migrations (Alembic), so future
  schema changes can be applied without losing existing data.
- Added CI test workflow (GitHub Actions) and architecture/ER documentation.

## Connected frontend to backend
- Replaced local browser storage with real fetch() calls to the API.
- Verified full create/edit/delete loop works end-to-end through the UI.
- Added staff authentication (JWT-based) — login required to create, edit,
  or delete fabrics.
- Reworked tests to create their own test user directly, independent of
  seed.py, so the test suite works the same locally and in CI.

## Image upload, role-based permissions, and hardened testing
- Added an `image_path` field to the Fabric model and a
  `POST /fabrics/{id}/image` endpoint for uploading a swatch photo per
  fabric (served as static files under `/uploads`).
- Added role-based access control: `admin` vs `staff` accounts. Only admins
  can delete fabrics; both roles can add/edit once logged in.
- Wired the frontend: login modal with JWT storage, image upload in the
  add/edit form, photo thumbnails in the catalog grid and detail view
  (falls back to a solid color swatch when no photo is set), and
  role-aware UI (delete hidden/blocked for non-admin accounts).
- Wrote a new test suite covering image upload (valid file, bad extension,
  missing auth, fabric-not-found) and delete permissions (staff blocked,
  admin allowed, missing auth, nonexistent fabric).
- Fixed a recurring CI failure caused by a stale, already-committed SQLite
  test database — `create_all()` only creates missing tables, so an old
  `.db` file didn't have the new `image_path` column. Fixed properly by
  making every test run generate its own fresh, disposable database file
  via `tests/conftest.py`, so schema changes can't silently break tests
  again.
- Cleaned up `.gitignore` (uploads/, `*.db`, `__pycache__/`, `.env`) and
  removed already-tracked build artifacts and stale database files from
  git history going forward.
- Updated README to reflect completed features.

## Next (optional, not required for current scope)
- Live deployment (currently local-only, which is sufficient for the
  thesis defense demo).
- Barcode/QR generation per fabric roll.
- Supplier management as its own entity.