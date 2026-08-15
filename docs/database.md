# Database Documentation

## Overview

Selvage uses SQLite as the database for the current academic prototype. The
database is accessed through SQLModel, which provides ORM functionality and
data validation.

## Database File

The main database file is:

`fabrics.db`

The database stores fabric, supplier, and user information required by the
application.

## Main Tables

### Fabric

Stores fabric catalogue information including:

- Fabric name and SKU
- Category and composition
- Colour and pattern
- Weight and width
- Price and stock quantity
- Supplier information
- Image path
- Season, usage, care, and notes

### Supplier

Stores supplier information separately from fabric records.

Supplier fields include:

- Supplier name
- Contact email
- Phone number

A supplier can be associated with multiple fabric records.

### User

Stores staff authentication information.

User records contain:

- Username
- Password hash
- Role

The supported roles are staff and admin.

## Database Migrations

Alembic is used to manage database schema changes.

Migrations allow database tables and columns to be updated while preserving
existing data.

Developers should create and apply migrations instead of manually recreating
the database.

## Development Database

SQLite is suitable for the current thesis prototype because it is lightweight
and requires minimal configuration.

The database can be replaced with PostgreSQL for a production deployment
without changing the application's main SQLModel-based data access approach.

## Backup and Production Considerations

The current Render deployment uses SQLite on free-tier storage. Database
persistence is therefore limited.

A production deployment should use a managed database service with reliable
persistent storage and regular backups.