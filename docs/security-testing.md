# Security Testing Guide

## Overview

Selvage includes several security controls to protect fabric catalog data,
staff accounts, and administrative operations. Security testing is used to
verify that authentication, authorization, input validation, and protected
API endpoints work as expected.

The project is an academic thesis prototype and is not intended for
production use with real business or customer data.

## Authentication Testing

The application uses JWT-based authentication for protected operations.

Security tests verify that:

- Valid staff credentials can authenticate successfully.
- Invalid usernames or passwords are rejected.
- Protected endpoints cannot be accessed without authentication.
- Invalid or expired authentication tokens are rejected.
- Passwords are stored using password hashing rather than plain text.

## Role-Based Authorization Testing

The system supports two user roles:

- **Staff** — can perform normal catalog operations such as viewing,
  creating, and updating fabric records.
- **Admin** — has additional administrative permissions such as deleting
  fabrics and suppliers.

Security tests verify that:

- Staff users can access permitted operations.
- Staff users cannot perform administrator-only operations.
- Admin users can perform authorized administrative operations.
- Unauthenticated users cannot access protected operations.

## API Security Testing

Protected API endpoints are tested to ensure that authentication and
authorization checks are applied correctly.

Testing includes:

- Accessing endpoints without a JWT token.
- Sending invalid authentication tokens.
- Attempting administrative operations using a staff account.
- Sending requests for nonexistent resources.
- Verifying appropriate HTTP status codes for unauthorized requests.

## Input Validation

FastAPI and SQLModel validation are used to validate incoming API data.

Testing verifies that:

- Required fields are validated.
- Invalid data types are rejected.
- Invalid fabric records cannot be created.
- Invalid supplier information is rejected where applicable.
- Requests containing invalid identifiers are handled safely.

## File Upload Security

The application supports uploading fabric images.

Security testing verifies:

- Authenticated users are required for image uploads.
- Uploads are associated with valid fabric records.
- Invalid file types are rejected.
- Requests for nonexistent fabric records are handled correctly.
- Uploaded files are stored in the dedicated upload directory.

Only supported image files should be accepted by the application.

## Database Security

The application uses SQLModel to interact with the SQLite database.

Security considerations include:

- Database operations are handled through the ORM.
- User passwords are not stored in plain text.
- Database schema changes are managed through Alembic migrations.
- Sensitive configuration values are provided through environment variables.
- The development database should not contain real customer information.

## Secret Management

Sensitive values such as JWT secrets and credentials must not be committed
to the Git repository.

Environment variables are used to provide:

- JWT secret values
- Authentication configuration
- Database configuration
- Other deployment-specific secrets

The `.env` file must remain excluded from version control.

## Automated Security Tests

Security-related functionality is included in the automated backend test
suite using pytest and FastAPI TestClient.

The tests cover:

- Authentication
- Role-based authorization
- Protected endpoints
- Invalid authentication attempts
- Image upload permissions
- Supplier permissions
- Administrative operations

Tests should be executed before significant changes are pushed:

```bash
pytest tests/ -v

```
##Security Limitations

The current project is an academic prototype, so some production security
features are not implemented.

Known limitations include:

API rate limiting is not currently enabled.
CORS is configured to support the deployed frontend.
SQLite is used instead of a managed production database.
Uploaded files use local storage in the current deployment.
Additional production monitoring and security logging would be required
for a real deployment.
Security Testing Checklist
 JWT authentication tested
 Password hashing implemented
 Role-based authorization tested
 Protected API endpoints tested
 Invalid authentication tested
 Input validation tested
 Image upload permissions tested
 Supplier permissions tested
 Environment variables used for secrets
 Automated backend security tests available
 API rate limiting for production
 Production security monitoring
 Persistent production file storage
##Conclusion

Security testing helps ensure that Selvage protects authenticated operations
and prevents unauthorized users from performing administrative actions.
The current implementation provides appropriate security controls for an
academic thesis prototype while identifying additional measures required
for future production deployment.