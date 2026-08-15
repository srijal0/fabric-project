# Project Development Workflow

## Overview

Selvage follows a structured development workflow to keep implementation,
testing, documentation, and version control organised throughout the project.

## Development Process

The main development process consists of:

1. Identify a required feature or improvement.
2. Implement the change in the appropriate frontend or backend component.
3. Update the database model when required.
4. Create or update automated tests.
5. Run the test suite locally.
6. Update relevant documentation.
7. Commit the changes to Git.
8. Push the changes to GitHub.
9. Review the result through the CI workflow.

## Feature Development

New features are developed incrementally rather than changing the entire
system at once.

For example, the supplier management functionality required changes to the
database model, API endpoints, frontend interface, authentication rules, and
automated tests.

## Database Changes

Database structure changes are handled using Alembic migrations.

A migration should be created whenever a database table, column, or
relationship needs to be changed.

Existing data should be preserved whenever possible rather than deleting and
recreating the database.

## Testing Workflow

Automated tests are run after implementing significant functionality.

The project uses pytest and FastAPI TestClient to verify backend behaviour.

Testing focuses on:

- Normal successful operations
- Authentication requirements
- Role-based permissions
- Invalid input
- Missing resources
- File uploads
- Supplier relationships
- QR code generation

## Documentation Workflow

Documentation is updated alongside major development changes.

Important project documentation includes:

- README
- System architecture
- Data model
- API documentation
- Testing guide
- Deployment guide
- Security policy
- Development notes
- Progress log

## Version Control

Git is used to track development history.

Changes are committed using descriptive commit messages that explain the
purpose of each change.

Examples include:

- `Add API documentation`
- `Update data model documentation`
- `Add testing documentation`
- `Add deployment documentation`

The repository is hosted on GitHub and changes are pushed regularly so that
the development history provides evidence of the project's progress.

## Continuous Integration

GitHub Actions is used to automatically run backend tests after repository
changes are pushed.

This provides an additional check that new changes have not introduced
regressions.

## Final Verification

Before the thesis submission and demonstration, the following should be
checked:

- Backend tests pass
- Frontend functionality works
- Authentication works correctly
- Staff and admin permissions are enforced
- Image uploads work
- Supplier management works
- QR code generation works
- Documentation reflects the final implementation
- The deployed demonstration is accessible