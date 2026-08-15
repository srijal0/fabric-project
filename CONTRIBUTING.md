# Contributing

This is an academic thesis project, developed individually. This document
records the working conventions used throughout development.

## Project structure

- `backend/` — FastAPI REST API (Python), SQLModel data models, JWT auth,
  Alembic migrations
- `frontend/` — static HTML/CSS/JS catalog UI, no build step
- `tests/` — automated backend tests (pytest)
- `docs/` — diagrams, notes, thesis write-up material

## Setup

See `README.md` for full setup instructions (running the backend and
frontend locally, applying migrations, and running tests).

## Commit conventions

Commits are scoped to a single, complete change (a feature, a fix, or a
documentation update) and use a short, descriptive present-tense message,
e.g. `Add supplier management, QR code generation, and their tests`.

## Code style

- Python: standard PEP 8 conventions; FastAPI routes use dependency
  injection for shared logic (authentication, role checks) rather than
  repeating it per route.
- JavaScript: vanilla JS, no build step; functions grouped by concern
  (auth/session handling, API calls, rendering, modals).
- CSS: custom properties (CSS variables) used for all colors and fonts to
  keep the design system centralized in `:root`.

## Database changes

Any change to a SQLModel table (adding or removing a field) must be
accompanied by an Alembic migration (`alembic revision --autogenerate`),
not a manually recreated database file, so existing data is never lost
when the schema changes.

## Data integrity

All sample data in this project (seeded via `backend/seed.py`) is
synthetic and created solely for demonstration and testing purposes. No
real supplier, customer, or business data is used anywhere in this
project.

## Testing guidelines

Run the automated test suite from the project root before committing changes:

```bash
pytest tests/ -v