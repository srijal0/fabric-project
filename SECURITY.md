# Security Policy

This is an academic thesis project (Selvage — Fabric & Material Cataloging
System), not a commercial production service. A live demo is deployed on
Render's free tier for demonstration and marking purposes; it is not
intended to hold real business or customer data.

## Scope

- **Live deployment**: the backend is hosted at
  `https://fabric-project-08hi.onrender.com` (free tier). The frontend is a
  static HTML/CSS/vanilla JS page that calls this API over HTTPS.
- **Data**: all fabric, supplier, and user records in the live demo are
  sample/seed data created for demonstration, not real business inventory.
- **Storage**: the live deployment uses SQLite on Render's free tier, which
  has **non-persistent storage** — the database and any uploaded fabric
  images reset whenever the server restarts or spins down after
  inactivity. This is a disclosed limitation of the free-tier demo, not a
  defect. A production deployment would use a managed database (e.g.
  hosted PostgreSQL) and dedicated file storage instead.

## Authentication and access control

Unlike a purely local demo, this project **does** implement real
authentication, since staff actions needed to be meaningfully restricted:

- Staff log in via a JWT-based flow (`python-jose` for tokens, `passlib`
  for password hashing) — passwords are never stored in plain text.
- Role-based access control distinguishes **admin** and **staff** accounts:
  staff can view, add, and edit fabrics; only admin accounts can delete
  fabrics or suppliers.
- Read-only catalog browsing does not require login; creating, editing, or
  deleting records does.

## Known limitations (by design, for an academic project)

- **Ephemeral storage on the free tier** — acceptable for a graded demo,
  not acceptable for real use without a persistent, managed database.
- **CORS is open** to allow the statically hosted frontend to call the
  Render-hosted backend across origins — acceptable for a two-part demo
  app, but would be locked down to specific origins in production.
- **No rate limiting** on API endpoints — acceptable for low-traffic
  academic demonstration, not for public production use.
- **Debug/reload mode is disabled in the deployed instance**, but may be
  enabled during local development (`uvicorn main:app --reload`) — this
  should never be enabled in a real production deployment.
- **JWT secret and any credentials** are supplied via environment
  variables on Render, not committed to the repository.

## Reporting an issue

If you notice a security concern in this codebase (e.g. a dependency with
a known vulnerability, or unsafe handling of user input), please open an
issue on the GitHub repository describing the concern.