# Development Progress Log

Keep this updated as you go — it's useful evidence of process for your thesis
defense, and helps you remember what you did and why.

# Initial prototype
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

# Connected frontend to backend
- Replaced local browser storage with real fetch() calls to the API.
- Verified full create/edit/delete loop works end-to-end through the UI.
- Added staff authentication (JWT-based) — login required to create, edit,
  or delete fabrics.
- Reworked tests to create their own test user directly, independent of
  seed.py, so the test suite works the same locally and in CI.

# Image upload, role-based permissions, and hardened testing
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


# QR codes, supplier management, and a second schema lesson applied
- Added a `/fabrics/{id}/qrcode` endpoint generating a scannable QR code
  (name, SKU, category, composition, supplier) on demand, downloadable from
  the frontend for printing and attaching to a physical roll.
- Added a `Supplier` entity (name, contact email, phone) and a `supplier_id`
  foreign key on `Fabric`, replacing the plain-text supplier field with a
  dropdown backed by real records, while keeping the old text field intact
  for backward compatibility.
- Added a "Manage Suppliers" screen on the frontend (add/list/delete),
  matching the same auth rules as fabrics (login to add, admin to delete).
- Deleting a supplier unlinks any fabrics pointing at it instead of leaving
  them broken.
- This schema change (a new column on the existing `fabric` table) hit the
  same category of problem as the image_path issue in July — but this time
  used Alembic migrations properly instead of deleting the local database.
  Found and fixed a real bug in the process: `alembic/env.py` only imported
  some of the project's models, so new tables/columns were invisible to
  Alembic's autogenerate comparison, producing empty migrations. Fixing the
  import list resolved it, and the migration applied cleanly without losing
  existing data.
- Wrote 11 new tests (supplier CRUD, QR generation, and a test specifically
  confirming deleting a supplier unlinks fabrics rather than breaking them).
  Full suite: 26 tests passing, CI green.
- Updated README and this log to reflect the finished feature set.

# Machine Learning Fabric Similarity Recommendations

* Added a Machine Learning-based fabric similarity recommendation feature to the Selvage system.
* Created `backend/ml/fabric_similarity.py` to calculate similarity between fabric records.
* Integrated the `all-MiniLM-L6-v2` Sentence Transformer model to generate semantic embeddings from fabric attributes.
* Combined fabric information such as name, category, composition, colour, pattern, weight/GSM, width, season, usage, and care instructions into a descriptive representation for the ML model.
* Added Scikit-learn similarity calculations to compare fabric embeddings and rank similar fabrics.
* Added the `GET /fabrics/{fabric_id}/similar` API endpoint for retrieving ranked similar fabric recommendations.
* Added frontend ML functionality in `frontend/js/ml.js`.
* Integrated the recommendation interface into `frontend/fabric-catalog.html`.
* Added similarity scores to the recommended fabric results.
* Added ML dependencies to `backend/requirements.txt`, including `sentence-transformers==3.2.1` and `scikit-learn==1.3.2`.
* Tested the ML module successfully and verified that the similarity API returns recommendations for existing fabric records.
* Fixed the GitHub Actions dependency installation issue caused by an invalid comment in `requirements.txt`.
* Updated the README and CHANGELOG to document the ML architecture, API endpoint, dependencies, frontend integration, and recommendation workflow.

## Current Status

* Core fabric catalogue and inventory management are implemented.
* JWT authentication and role-based permissions are implemented.
* Fabric image upload is implemented.
* Supplier management is implemented.
* QR code generation is implemented.
* Analytics functionality is implemented.
* Machine Learning-based fabric similarity recommendations are implemented.
* Frontend ML recommendation interface is integrated.
* REST API integration is working.
* Backend automated tests and GitHub Actions CI are configured.
* The project is deployed on Render.
* README and CHANGELOG documentation have been updated.
* The remaining work is focused on final regression checking, deployment verification, and thesis presentation/viva preparation.

## Next

* Perform a final regression check on the deployed application.
* Verify the ML recommendation feature on the deployed system.
* Confirm GitHub Actions CI is passing after the ML dependency changes.
* Prepare the final thesis documentation.
* Prepare for the final presentation and viva.


## Next
- Final regression check on the live deployment before submission.
- Exam, presentation, and viva prep — due August 20, 2026.

## Current Status

- Core catalog, authentication, role-based permissions, image upload,
  supplier management, QR generation, and analytics features are implemented.
- Backend tests are passing and the project includes automated CI testing.
- Documentation has been updated to reflect the current project structure
  and implemented features.
- The remaining work is focused on final regression checking and thesis
  presentation preparation.