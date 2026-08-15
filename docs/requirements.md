# Project Requirements

## Overview

This document describes the main functional and technical requirements of
the Selvage Fabric & Material Cataloging System.

## Functional Requirements

### Fabric Management

The system should allow authorised staff to:

- View fabric records.
- Add new fabric records.
- Edit existing fabric records.
- Search for fabrics.
- Filter fabrics by relevant attributes.
- Sort fabric records.
- View fabric stock information.
- Upload fabric images.

### Supplier Management

The system should allow authorised users to:

- View suppliers.
- Add supplier information.
- Associate suppliers with fabric records.
- Delete suppliers when appropriate.
- Safely unlink fabrics when a supplier is removed.

### Authentication

The system should:

- Provide staff login functionality.
- Validate user credentials.
- Use password hashing.
- Generate JWT tokens after successful authentication.
- Protect operations that require authentication.

### Authorization

The system should support role-based access control.

Staff users can:

- View fabrics.
- Add fabrics.
- Edit fabrics.

Administrators can additionally:

- Delete fabrics.
- Delete suppliers.
- Perform other administrative operations.

### QR Code Generation

The system should allow useful fabric information to be represented through
generated QR codes.

QR information can include:

- Fabric name
- SKU
- Category
- Composition
- Supplier

### Dashboard and Analytics

The system should provide useful inventory information such as:

- Total fabric count
- Total stock quantity
- Category counts
- Stock by category
- Stock value by supplier
- Low-stock information

## Non-Functional Requirements

### Usability

The application should provide a simple interface that allows users to
manage fabric information without unnecessary complexity.

### Performance

API requests should respond efficiently for the expected dataset size of the
academic prototype.

### Security

The system should:

- Protect authenticated operations.
- Use password hashing.
- Use JWT authentication.
- Apply role-based authorization.
- Keep secrets outside the source code.
- Validate user input.
- Validate uploaded files.

### Maintainability

The system should use a modular backend structure and maintain clear
documentation for development, testing, deployment, and maintenance.

### Reliability

Automated backend tests should verify important application functionality
and help identify regressions during development.

### Compatibility

The frontend should operate in modern web browsers and communicate with the
FastAPI backend using HTTP requests and JSON.

## Technical Requirements

### Backend

- Python
- FastAPI
- SQLModel
- SQLAlchemy
- SQLite
- Alembic
- JWT authentication
- pytest
- FastAPI TestClient

### Frontend

- HTML
- CSS
- JavaScript
- Fetch API

### Development Tools

- Git
- GitHub
- GitHub Actions
- Render for demonstration deployment

## Database Requirements

The database should store the main application entities:

- Fabric
- Supplier
- User

Database schema changes should be managed through Alembic migrations.

## Deployment Requirements

The application should be deployable as a separate frontend and backend
system.

The backend should provide a REST API that the frontend can access over
HTTPS in the deployed environment.

The current thesis deployment uses Render for demonstration purposes.

## Testing Requirements

The backend should include automated tests for:

- Fabric CRUD operations
- Authentication
- Role-based authorization
- Supplier management
- Image uploads
- QR code generation
- Invalid requests
- Protected endpoints

Tests should be executed using:

```bash
pytest tests/ -v

```
##Project Constraints

The current system is an academic thesis prototype.

Therefore:

SQLite is suitable for the current scope.
The deployed free-tier environment may have storage limitations.
The system does not contain real customer or business data.
Production deployment would require additional infrastructure and security
controls.
Requirements Checklist
 Fabric management
 Supplier management
 User authentication
 Role-based authorization
 Image uploads
 QR code generation
 Dashboard analytics
 Automated backend testing
 Database migrations
 Deployment documentation
 Security documentation
##Conclusion

The requirements define the functionality, quality attributes, and technical
constraints of the Selvage system. They provide a reference for development,
testing, evaluation, and future improvements.


