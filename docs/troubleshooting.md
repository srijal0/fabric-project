# Troubleshooting Guide

## Overview

This guide provides solutions to common development and deployment issues
that may occur while working with the Selvage system.

## Backend Does Not Start

If the FastAPI backend does not start, first check that the required
dependencies are installed.

Run:

```bash
pip install -r requirements.txt

```
Then start the backend:

uvicorn backend.main:app --reload --port 8001

Check the terminal output for missing packages or configuration errors.

##Database Errors

If a database error occurs after changing the SQLModel definitions, check
whether an Alembic migration is required.

The database schema should be updated through Alembic rather than manually
recreating the database.

Run the appropriate migration after reviewing the generated migration file.

##Authentication Problems

If login does not work, check:

The username and password are correct.
The backend is running.
The JWT configuration is available through environment variables.
The frontend is sending the authentication request to the correct API.
The returned JWT token is being stored correctly.

If a protected request returns 401, check whether a valid authentication
token is being sent.

If a request returns 403, check whether the logged-in user has the required
role.

Fabric Operations Fail

If creating, editing, or deleting a fabric fails:

Check that the backend is running.
Check the browser developer console.
Check the API response status code.
Confirm that authentication is valid.
Check whether the user has the required permissions.
Run the backend test suite.
Image Upload Problems

If an image cannot be uploaded, check:

The fabric record exists.
The user is authenticated.
The selected file uses an accepted image format.
The upload endpoint is available.
The upload directory is configured correctly.
Supplier Problems

If supplier operations fail, check:

The user is authenticated.
Administrator permissions are available for deletion.
The supplier record exists.
The supplier relationship with fabric records is valid.

When a supplier is deleted, associated fabrics should be safely unlinked
rather than deleted.

##QR Code Problems

If QR code generation fails, check:

The requested fabric exists.
The backend is running.
The QR code endpoint is reachable.
The fabric contains the required information.
Frontend Cannot Connect to Backend

If the frontend does not display data, check:

The backend URL configured in the frontend.
The backend deployment is running.
The browser console for network errors.
CORS configuration.
The API endpoint being requested.
Tests Fail

Run:

pytest tests/ -v

If tests fail after a database model change, verify that the test database is
being created correctly and that the required migration or test fixture has
been updated.

##Deployment Problems

For deployment issues, check:

Render service status.
Environment variables.
Python dependencies.
Start command.
Backend logs.
Database configuration.
Frontend API URL.
Security Issues

Never solve configuration problems by committing secrets or credentials to
the repository.

Sensitive values should remain in environment variables.

If a secret is accidentally exposed, revoke and replace it immediately.

##Final Check

Before reporting an issue as unresolved:

 Check the terminal output.
 Check browser console errors.
 Check API response status codes.
 Run the automated tests.
 Check environment variables.
 Check the relevant documentation.