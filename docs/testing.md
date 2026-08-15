# Testing Guide

## Overview

Selvage uses automated backend tests to verify the main API functionality,
authentication, permissions, image handling, supplier management, and QR code
generation.

The test suite is implemented using pytest and FastAPI TestClient.

## Running Tests

Run the complete test suite from the project root:

```bash
pytest tests/ -v

```
##Test Coverage

The test suite covers the following areas:

Fabric Operations
Creating fabric records
Retrieving fabric records
Updating fabric records
Deleting fabric records
Handling requests for nonexistent fabrics
Authentication

Tests verify that protected operations require valid authentication.

The tests also create their own test users so that they do not depend on
development seed data.

##Role-Based Access Control

The system supports staff and administrator roles.

Tests verify that:

Staff users can perform permitted catalog operations.
Staff users cannot perform administrator-only deletions.
Administrators can perform administrative operations.
Unauthenticated users cannot access protected operations.
##Image Uploads

Image upload tests verify:

Valid image uploads
Invalid file extensions
Missing authentication
Uploading an image for a nonexistent fabric
Supplier Management

##Supplier tests verify:

Creating suppliers
Retrieving suppliers
Deleting suppliers
Handling supplier relationships with fabrics
Unlinking fabrics when a supplier is deleted
QR Code Generation

Tests verify that QR codes can be generated for valid fabric records and that
requests for nonexistent fabrics are handled correctly.

##Test Database

Tests use a separate disposable SQLite database rather than the development
database.

This prevents test execution from modifying development data and avoids
problems caused by stale database schemas.

Each test run creates a fresh database environment.

##Continuous Integration

GitHub Actions automatically runs the backend test suite when changes are
pushed to the repository.

This helps detect regressions before changes are considered complete.

Before Pushing Changes

Developers should run:

pytest tests/ -v

All tests should pass before pushing significant changes to the repository.

##Current Test Status

The latest completed development stage contains 26 passing backend tests.

The test suite covers the main functionality implemented for the thesis
prototype.