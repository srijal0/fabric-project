# Selvage — Fabric & Material Cataloging System

A web-based inventory and cataloging system for clothing store fabrics and
materials, built as a thesis project. Store staff can add, search, filter,
and track fabric stock (composition, GSM, price, supplier, stock levels) in
one place instead of spreadsheets or physical swatch books.

**Live deployment:** https://fabric-project-08hi.onrender.com/docs
(free-tier hosting — see Deployment notes below)

## Architecture

```
frontend/   -> Static HTML/JS catalog UI (calls the backend over REST)
backend/    -> Python FastAPI REST API + SQLite database + Alembic migrations
tests/      -> Automated tests for the backend API
docs/       -> Diagrams, notes, thesis write-up material
```

The frontend and backend are separate, talking over HTTP — the same pattern
used in most modern web apps, just simpler since this project doesn't need a
JS framework.

## Tech stack

- **Backend:** Python, FastAPI, SQLModel (SQLAlchemy + Pydantic), SQLite
- **Migrations:** Alembic, for schema changes without losing existing data
- **Auth:** JWT-based login (`python-jose` + `passlib`), role-based access
  control (`admin` / `staff`)
- **Frontend:** HTML, CSS, vanilla JavaScript (fetch API)
- **QR codes:** `qrcode[pil]`, generated on demand per fabric
- **Data model:** see `backend/models.py` — a `Fabric` entity with fields for
  identification (name, SKU, category), physical properties (composition,
  weight, width, color, image), and business data (price, stock, season);
  a `Supplier` entity (name, contact email, phone) linked to fabrics via
  `supplier_id`; a `User` entity for staff accounts with a role field.
- **Testing:** pytest + FastAPI's `TestClient`, 26 tests, run automatically
  on every push via GitHub Actions CI (see `.github/workflows/`)
- **Deployment:** backend on Render (free tier), auto-deploys from `main`

## Running it locally

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
alembic upgrade head         # applies database migrations
python seed.py                # creates fabrics.db with sample data (run once)
uvicorn main:app --reload     # starts the API at http://127.0.0.1:8000
```

Interactive API docs: http://127.0.0.1:8000/docs

### 2. Frontend
Just open `frontend/fabric-catalog.html` in a browser. By default it points
at the live Render deployment — edit the `API_BASE` constant near the top of
the `<script>` block to point at `http://127.0.0.1:8000` instead if you want
to test against your local backend.

Click **Staff login** in the top right to sign in and unlock add/edit/delete
actions. Check `backend/seed.py` for the seeded test account credentials.

### 3. Running tests
```bash
cd backend      # or repo root — pytest resolves paths via tests/conftest.py
pytest tests/ -v
```

## Features

- Full CRUD for fabrics (create, view, edit, delete)
- Search by name, SKU, supplier, or composition
- Filter by category, sort by name/price/stock/date added
- Low-stock flagging (below 20m)
- Live dashboard stats (total fabrics, total stock, categories)
- **Staff authentication** — JWT-based login required to create or edit
  fabrics
- **Role-based permissions** — only `admin`-role accounts can delete
  fabrics or suppliers; `staff`-role accounts can view, add, and edit
- **Fabric photos** — upload a swatch photo per fabric; displayed as a
  thumbnail in the catalog grid and detail view (falls back to a solid
  color block from the fabric's hex color when no photo is set)
- **QR codes** — generate a scannable QR code per fabric encoding its name,
  SKU, category, composition, and supplier; downloadable for printing and
  attaching to a physical roll
- **Supplier management** — a dedicated Supplier entity (name, contact
  email, phone) that fabrics can be linked to via a dropdown; deleting a
  supplier safely unlinks any fabrics pointing at it rather than breaking
  them
- **Automated tests + CI** — 26 tests covering CRUD, auth, permissions,
  image upload, supplier management, and QR generation, run on every push
- **Live deployment** — backend hosted on Render, auto-deploys from `main`

## Deployment notes

The live deployment runs on Render's free tier, which uses **non-persistent
storage** — the SQLite database and any uploaded images reset when the
server restarts or spins down after inactivity. This is an accepted,
disclosed limitation of the free-tier demo deployment, not a defect in the
system. A production deployment would use a managed database (e.g. hosted
PostgreSQL) and dedicated file storage instead.

## Status / next steps

See `PROGRESS.md` for the development log and `docs/` for architecture notes.

Optional future work (not required for current scope): supplier-level
reporting (e.g. total stock value by supplier), point-of-sale integration,
multi-location stock sync, automated frontend tests.