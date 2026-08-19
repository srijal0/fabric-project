# Contributing

This is an academic thesis project, developed individually. This document
records the working conventions used throughout development.

## Project structure

- `backend/` — FastAPI REST API (Python), SQLModel data models, JWT auth,
  Alembic migrations
- `backend/ml/` — machine learning module for semantic fabric similarity
  and recommendation generation
- `frontend/` — static HTML/CSS/JS catalog UI, no build step
- `frontend/js/ml.js` — frontend logic for displaying ML-based fabric
  recommendations
- `tests/` — automated backend tests (pytest)
- `docs/` — diagrams, notes, thesis write-up material

## Setup

See `README.md` for full setup instructions (running the backend and
frontend locally, installing ML dependencies, applying migrations, and
running tests).

## Commit conventions

Commits are scoped to a single, complete change (a feature, a fix, or a
documentation update) and use a short, descriptive present-tense message.

Examples:

- `Add supplier management and QR code generation`
- `Add fabric similarity ML model`
- `Integrate ML similarity API`
- `Add frontend ML recommendations`
- `Fix Python dependencies for ML`

## Code style

- Python: standard PEP 8 conventions; FastAPI routes use dependency
  injection for shared logic (authentication, role checks) rather than
  repeating it per route.
- Machine learning: ML-related functionality should be kept inside
  `backend/ml/` where possible. Fabric attributes should be converted into
  a consistent text representation before generating embeddings.
- JavaScript: vanilla JS, no build step; functions grouped by concern
  (auth/session handling, API calls, rendering, modals, and ML
  recommendations).
- CSS: custom properties (CSS variables) used for all colors and fonts to
  keep the design system centralized.

## Machine Learning dependencies

The ML recommendation functionality uses:

- `sentence-transformers==3.2.1`
- `scikit-learn==1.3.2`
- `all-MiniLM-L6-v2` for generating semantic fabric embeddings

ML dependencies are listed in `backend/requirements.txt`.

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

Run the automated test suite from the project root before committing
changes:

```bash
pytest tests/ -v