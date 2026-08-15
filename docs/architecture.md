# System Architecture

## Overview

Selvage is a two-tier web application: a browser-based frontend communicates
with a Python REST API over HTTP. The backend handles authentication,
validation, business logic, file handling, and database operations.

```mermaid
flowchart LR
    A[Browser<br/>fabric-catalog.html] -- fetch / JSON over HTTP --> B[FastAPI Backend<br/>main.py]
    B -- SQLModel ORM --> C[(SQLite<br/>fabrics.db)]
    B -- JWT Authentication --> D[Authentication & Roles]
    B -- File Handling --> E[Fabric Images]
    B -- QR Generation --> F[QR Codes]

Layers
Frontend (frontend/)

The frontend uses plain HTML, CSS, and JavaScript without a framework or
build step.

Main responsibilities include:

Fetching and displaying fabric records from the API
Searching, filtering, and sorting fabrics
Adding and editing fabric information
Uploading and displaying fabric images
Staff login and JWT session handling
Role-based actions for staff and administrators
Supplier management
QR code generation and download
Dashboard and analytics visualisation
Backend (backend/)

The backend is implemented using FastAPI and provides the REST API.

main.py — FastAPI application and REST endpoints
models.py — SQLModel database models and validation schemas
database.py — database engine and session configuration
auth.py — authentication and JWT functionality
seed.py — creates sample data for development and demonstrations
alembic/ — database schema migrations
uploads/ — uploaded fabric images

The backend also handles authentication and role-based permissions for
protected operations.

Data layer

The application currently uses SQLite through SQLModel.

The main entities include:

Fabric — stores fabric identification, physical properties, pricing,
stock, images, and supplier information.
Supplier — stores supplier name and contact information.
User — stores staff account information and user roles.

Alembic is used to manage database schema changes while preserving existing
data.

SQLite is suitable for the current thesis prototype and demonstration.
A production deployment could use a managed relational database such as
PostgreSQL.

Authentication and authorization

The system uses JWT-based authentication.

A staff member submits login credentials.
The backend validates the credentials.
A JWT token is returned after successful authentication.
The frontend uses the token for authenticated requests.
Protected API endpoints verify the token.
Role-based authorization determines whether the user is a staff or
admin account.

Staff users can perform normal catalog operations, while administrator-only
operations such as deleting fabrics or suppliers require the appropriate
role.

Request flow example: adding a fabric
User signs in through the frontend.
The frontend sends the login credentials to the authentication endpoint.
FastAPI validates the credentials and returns a JWT token.
User fills out the "Add Fabric" form and clicks Save.
Frontend sends POST /fabrics with the form data and authentication token.
FastAPI validates the request.
The backend checks authentication and permissions.
SQLModel inserts the new record into the database.
The API returns the saved fabric with its database ID.
The frontend refreshes the catalog so the new fabric appears.
Image upload flow
An authenticated user selects a fabric image.
The frontend sends the image to the image upload endpoint.
The backend validates the request and fabric record.
The image is stored in the uploads directory.
The fabric record stores the image path.
The frontend displays the uploaded image in the catalog.
Supplier and QR code flow

Suppliers are stored as separate database records and can be linked to
fabric records through the supplier_id relationship.

The QR code endpoint generates a QR image containing useful fabric
information such as:

Fabric name
SKU
Category
Composition
Supplier

The generated QR code can be downloaded from the frontend for use with
physical fabric rolls.

Testing and continuous integration

The backend uses pytest and FastAPI's TestClient for automated testing.

The test suite covers areas including:

Fabric CRUD operations
Authentication
Role-based permissions
Image uploads
Supplier management
QR code generation

GitHub Actions runs the automated test suite when changes are pushed to the
repository, helping detect regressions during development.

Deployment

The backend is deployed on Render and the frontend communicates with the
deployed API.

The current deployment uses SQLite and free-tier storage, which means
database and uploaded-file persistence is limited. A production deployment
could use a managed database and dedicated file storage.

Why this stack
FastAPI — provides automatic interactive API documentation and a clear
structure for building REST APIs.
SQLModel — combines database modelling with Pydantic-based validation
while working with SQLAlchemy.
SQLite — lightweight and appropriate for the current thesis prototype.
Plain HTML/CSS/JavaScript — avoids unnecessary build tooling and keeps
the frontend simple to understand and demonstrate.
Alembic — provides controlled database schema migrations.
pytest — supports automated backend testing and regression checking.