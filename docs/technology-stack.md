# Technology Stack

## Overview

Selvage is a lightweight web-based fabric and material cataloguing system.
The technology stack was selected to keep the application simple to develop,
test, maintain, and demonstrate.

## Frontend

The frontend uses:

- HTML5
- CSS3
- JavaScript
- Fetch API

The application does not use a frontend framework or build system.

The frontend is responsible for displaying the fabric catalogue, searching
and filtering records, managing forms, uploading images, handling
authentication sessions, managing suppliers, and displaying analytics.

## Backend

The backend uses:

- Python
- FastAPI
- Uvicorn

FastAPI provides the REST API used by the frontend and also provides automatic
interactive API documentation.

## Database

The application uses:

- SQLite
- SQLModel
- SQLAlchemy

SQLite provides lightweight local database storage suitable for the current
academic prototype.

SQLModel provides the database models and validation layer while working with
SQLAlchemy.

## Database Migrations

Alembic is used for database schema migrations.

This allows changes to tables, columns, and relationships to be applied
without unnecessarily recreating the database.

## Authentication

Authentication uses:

- JWT tokens
- Password hashing
- Role-based authorization

The application supports staff and administrator roles.

## Testing

The testing stack includes:

- pytest
- FastAPI TestClient

Automated tests verify the main API functionality, authentication,
permissions, image uploads, supplier management, and QR code generation.

## Continuous Integration

GitHub Actions is used to automatically run the backend test suite when
changes are pushed to the repository.

This helps identify regressions during development.

## Version Control

Git is used for version control and GitHub is used to host the repository.

Descriptive commits are used to maintain a clear development history.

## Deployment

The backend is deployed to Render for the thesis demonstration.

The current deployment uses SQLite and free-tier storage, so it is intended
for academic evaluation rather than production business use.

## Future Technology Improvements

For a production version, the following technologies or services could be
considered:

- PostgreSQL for persistent relational database storage
- Dedicated object storage for fabric images
- Production-grade monitoring and logging
- API rate limiting
- Restricted CORS configuration
- Automated production deployment