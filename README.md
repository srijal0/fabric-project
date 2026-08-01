# Selvage — Fabric & Material Cataloging System

A web-based inventory and cataloging system for clothing store fabrics and
materials, built as a thesis project. Store staff can add, search, filter,
and track fabric stock (composition, GSM, price, supplier, stock levels) in
one place instead of spreadsheets or physical swatch books.

## Architecture

```
frontend/   -> Static HTML/JS catalog UI (calls the backend over REST)
backend/    -> Python FastAPI REST API + SQLite database
tests/      -> Automated tests for the backend API
docs/       -> Diagrams, notes, thesis write-up material
```

The frontend and backend are separate, talking over HTTP — the same pattern
used in most modern web apps (and in larger student/reference projects like
FastAPI + Next.js setups), just simpler since this project doesn't need a
JS framework.

## Tech stack

- **Backend:** Python, FastAPI, SQLModel (SQLAlchemy + Pydantic), SQLite
- **Auth:** JWT-based login (`python-jose` + `passlib`), role-based access
  control (`admin` / `staff`)
- **Frontend:** HTML, CSS, vanilla JavaScript (fetch API)
- **Data model:** see `backend/models.py` — one `Fabric` entity with fields
  for identification (name, SKU, category), physical properties (composition,
  weight, width, color, image), and business data (price, stock, supplier,
  season); one `User` entity for staff accounts with a role field.
- **Testing:** pytest + FastAPI's `TestClient`, run automatically on every
  push via GitHub Actions CI (see `.github/workflows/`)

## Running it locally

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python seed.py              # creates fabrics.db with sample data (run once)
uvicorn main:app --reload   # starts the API at http://127.0.0.1:8000
```

Interactive API docs: http://127.0.0.1:8000/docs

### 2. Frontend
Just open `frontend/fabric-catalog.html` in a browser while the backend is
running. It talks to `http://127.0.0.1:8000` automatically.

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
  fabrics; `staff`-role accounts can view, add, and edit
- **Fabric photos** — upload a swatch photo per fabric; displayed as a
  thumbnail in the catalog grid and detail view (falls back to a solid
  color block from the fabric's hex color when no photo is set)
- **Automated tests + CI** — API tests covering CRUD, auth, permissions,
  and image upload run on every push

## Status / next steps

See `PROGRESS.md` for the development log and `docs/` for architecture notes.

Optional future work (not required for current scope): live deployment
(currently local-only), barcode/QR generation per fabric roll, supplier
management as its own entity.