# Maintenance Guide

## Overview

This guide describes the basic maintenance activities required to keep the
Selvage system working correctly during development and demonstration.

## Backend Maintenance

The FastAPI backend should be kept up to date with the project's dependency
configuration.

Before making dependency changes, the existing test suite should be executed
to establish a working baseline.

After updating dependencies, run:

```bash
pytest tests/ -v

```
All tests should pass before the changes are pushed.

##Database Maintenance

The project uses SQLite for the current academic prototype.

Database schema changes must be managed through Alembic migrations.

Developers should avoid manually modifying the database structure because
this can cause differences between local and deployed environments.

Before applying a schema change:

Update the SQLModel definitions.
Generate an Alembic migration.
Review the generated migration.
Apply the migration.
Run the automated tests.
File Upload Maintenance

Fabric images are stored through the application's upload functionality.

Uploaded files should not be committed to Git.

The project's .gitignore configuration excludes generated upload files and
local database files.

Security Maintenance

Authentication secrets and other sensitive configuration values must remain
outside the source code.

Environment variables should be used for:

JWT secrets
Database credentials
Deployment credentials
Other sensitive configuration

If a secret is accidentally committed, it should be revoked and replaced
rather than simply deleting it from the latest commit.

Dependency Maintenance

Project dependencies should be reviewed periodically for outdated or
vulnerable packages.

Dependabot is configured to help identify dependency updates.

Dependency updates should be tested before being merged into the project.

Deployment Maintenance

The deployed demonstration should be checked before important presentations
or assessments.

The following should be verified:

API is reachable
Frontend can communicate with the API
Login works
Fabric records can be viewed
Fabric creation and editing work
Supplier management works
QR code generation works
Image upload works
Administrator permissions work correctly
Backup Considerations

The current free-tier deployment uses SQLite and temporary storage.

The deployed environment should therefore not be treated as permanent
business data storage.

For a production system, persistent database storage and dedicated file
storage should be configured.

Pre-Demonstration Checklist

Before the thesis demonstration:

 Run the complete test suite
 Check the deployed API
 Check frontend connectivity
 Verify authentication
 Verify staff permissions
 Verify administrator permissions
 Test image upload
 Test supplier management
 Test QR code generation
 Review project documentation
 Confirm no secrets are committed