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
- **Frontend:** HTML, CSS, vanilla JavaScript (fetch API)
- **Data model:** see `backend/models.py` — one `Fabric` entity with fields
  for identification (name, SKU, category), physical properties (composition,
  weight, width, color), and business data (price, stock, supplier, season).

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

## Features

- Full CRUD for fabrics (create, view, edit, delete)
- Search by name, SKU, supplier, or composition
- Filter by category, sort by name/price/stock/date added
- Low-stock flagging (below 20m)
- Live dashboard stats (total fabrics, total stock, categories)

## Status / next steps

See `PROGRESS.md` for the development log and `docs/` for architecture notes.

Planned next steps: authentication for staff accounts, image uploads per
fabric, and a proper deployment (currently local-only).
