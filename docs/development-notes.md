# Development Notes

This document records useful development notes for the Selvage project.

## Backend

The backend is built with FastAPI, SQLModel, SQLite, and Alembic.

- API endpoints are defined in `backend/main.py`
- Database models are defined using SQLModel
- Authentication uses JWT tokens
- Database schema changes are managed with Alembic
- Automated tests are located in `tests/`

## Frontend

The frontend uses plain HTML, CSS, and JavaScript.

- No frontend framework is required
- API requests are made using `fetch()`
- Fabric records can be searched, filtered, sorted, added, and edited
- Images can be uploaded and displayed in the catalog
- Supplier management and QR code functionality are available

## Testing

Run the backend test suite from the project root:

```bash
pytest tests/ -v
```
Tests should be run before pushing significant changes.

##Database

SQLite is used for the current academic prototype.

Schema changes should always be handled through Alembic migrations rather
than recreating the database.

##Security

Authentication and role-based access control protect operations that modify
fabric and supplier records.

Sensitive values such as JWT secrets and credentials must be provided
through environment variables and must not be committed to Git.

##Deployment

The backend has been deployed to Render for demonstration purposes.

The deployment is intended for academic evaluation and does not contain
real business or customer data.