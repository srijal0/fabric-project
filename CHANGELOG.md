# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]
### Documentation

- Added clearer project structure and documentation references to help
  contributors navigate the backend, frontend, tests, and documentation
  directories.


### Added
- Supplier entity (name, contact email, phone) with full CRUD endpoints.
- `supplier_id` foreign key on Fabric, linking fabrics to a saved supplier
  via a frontend dropdown, while keeping the original free-text supplier
  field for backward compatibility.
- QR code generation endpoint (`/fabrics/{id}/qrcode`), encoding a fabric's
  name, SKU, category, composition, and supplier as a scannable, downloadable
  PNG.
- 11 new automated tests covering supplier CRUD and QR code generation,
  including a test confirming that deleting a supplier safely unlinks any
  fabrics pointing at it instead of breaking them.
- Analytics page (stock by category, stock value by supplier, low vs
  healthy stock breakdown) using Chart.js, computed client-side from
  already-loaded data.

### Fixed
- `alembic/env.py` was only importing some of the project's models, so
  new tables and columns were invisible to Alembic's migration
  autogeneration, producing empty migrations. Corrected the import list
  and applied the supplier schema change as a proper migration instead of
  recreating the local database.


### Added
- Fabric image upload (`POST /fabrics/{id}/image`), served as static files
  and shown as thumbnails in the catalog grid and detail view.
- Role-based access control: `admin` vs `staff` accounts, with fabric
  deletion restricted to admins.
- Automated test suite covering image upload and role-based permissions.
- Live deployment to Render (backend), with the frontend pointed at the
  deployed API.

### Fixed
- A schema change (adding `image_path` to the Fabric model) broke CI with
  a "no such column" error, caused by a stale, already-committed SQLite
  test database. `create_all()` only creates missing tables, it does not
  alter existing ones. Fixed by making every test run generate its own
  fresh, disposable database file instead of relying on a saved one.
- Removed already-tracked build artifacts, stale database files, and
  uploaded images from version control; added a proper `.gitignore`.


### Added
- JWT-based staff authentication (`/auth/login`, `/auth/me`).
- Login required to create, edit, or delete fabric records.
- Reworked tests to create their own test user directly, independent of
  `seed.py`, so the suite behaves the same locally and in CI.


### Added
- Initial FastAPI + SQLModel + SQLite backend with full CRUD for fabric
  records (name, SKU, category, composition, weight, width, color,
  price, stock, supplier, season, usage, care, notes).
- HTML/CSS/JavaScript frontend consuming the API directly (no framework).
- Search, category filtering, and sorting.
- Low-stock flagging and live dashboard stats.
- Database migrations via Alembic; environment configuration via `.env`.
- GitHub Actions CI workflow running the test suite on every push.