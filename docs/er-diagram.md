# Data Model / ER Diagram

Selvage uses three main entities: **Fabric**, **Supplier**, and **User**.
Fabric records can be associated with suppliers through `supplier_id`, while
users are used for authentication and role-based access control.

```mermaid
erDiagram
    SUPPLIER ||--o{ FABRIC : supplies

    SUPPLIER {
        int id PK
        string name
        string contact_email
        string phone
    }

    FABRIC {
        int id PK
        string name
        string sku
        string category
        string composition
        string color_name
        string color_hex
        string pattern
        float weight_gsm
        float width_cm
        float price_per_meter
        float stock_meters
        string supplier
        int supplier_id FK
        string season
        string usage
        string care
        string notes
        string image_path
        float date_added
    }

    USER {
        int id PK
        string username
        string password_hash
        string role
    }
    ```

## Entity Descriptions
Fabric

The Fabric entity stores the main catalog information for each fabric.

It includes:

Identification information such as name and SKU
Fabric category and composition
Colour and pattern information
Weight and width measurements
Price and current stock quantity
Supplier information
Season, usage, care instructions, and notes
Uploaded fabric image path
Date the fabric was added
Supplier

The Supplier entity stores supplier information separately from the
fabric record.

A supplier can be associated with multiple fabric records through the
supplier_id foreign key.

Supplier information includes:

Supplier name
Contact email
Phone number

When a supplier is deleted, associated fabrics can be safely unlinked rather
than being deleted.

User

The User entity supports staff authentication and role-based access control.

User records include:

Username
Password hash
User role

The system currently supports two roles:

Staff — can view, add, and edit fabric records
Admin — has additional permissions such as deleting fabrics and
suppliers
Relationships
Supplier to Fabric

The relationship between Supplier and Fabric is:

One Supplier → Many Fabrics

A supplier can provide multiple fabrics, while each fabric can reference a
supplier through supplier_id.

The original text-based supplier field is also retained for backward
compatibility.

User and Authentication

Users are not directly related to Fabric records through a database foreign
key. Instead, User records are used by the authentication system to control
access to protected operations.

Derived Information

Some information displayed by the application is calculated from existing
fabric records rather than stored as separate database entities.

Examples include:

Low-stock status
Total fabric count
Total stock quantity
Category counts
Stock by category
Stock value by supplier
Database Migrations

Database schema changes are managed using Alembic migrations.

This allows new tables, columns, and relationships to be introduced without
recreating the existing database and losing stored data.

Future Extensions

If the system grows beyond the current thesis prototype, possible future
entities and improvements include:

StockMovement — records stock additions, reductions, reasons, and
timestamps to provide an auditable inventory history.
Category — stores predefined fabric categories in a separate table.
AuditLog — records important administrative actions.
Multi-location inventory — supports stock management across multiple
stores or warehouses.


