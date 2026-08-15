# Code Quality Guide

## Overview

Selvage follows basic code quality practices to keep the project organised,
maintainable, and easier to test.

## Backend Code Quality

The backend is developed using Python and FastAPI.

The project follows these practices:

- Backend functionality is separated into appropriate modules.
- Database models are defined using SQLModel.
- API routes are kept within the FastAPI application structure.
- Authentication logic is separated from general application logic.
- Database changes are managed using Alembic migrations.
- Reusable functionality is kept in separate modules where appropriate.

## Frontend Code Quality

The frontend uses plain HTML, CSS, and JavaScript.

The frontend follows these practices:

- HTML provides the page structure.
- CSS is used for presentation and layout.
- JavaScript handles application behaviour and API communication.
- API requests use the Fetch API.
- Functions are organised according to their responsibilities.
- Existing functionality is preserved when making changes.

## Naming Conventions

Clear and descriptive names should be used for:

- Variables
- Functions
- Classes
- Database models
- API endpoints
- Documentation files

Names should describe their purpose and avoid unnecessary abbreviations.

## Error Handling

The application should handle expected errors gracefully.

Examples include:

- Invalid API requests
- Missing authentication
- Invalid user credentials
- Missing fabric records
- Invalid image uploads
- Database operation failures

API responses should provide suitable HTTP status codes and useful error
messages.

## Testing and Quality Checks

Backend changes should be tested using pytest.

Run the test suite with:

```bash
pytest tests/ -v


```
All relevant tests should pass before significant changes are pushed.

##Documentation

Important project functionality should be documented so that the system
can be understood and maintained by other developers.

Documentation includes:

System architecture
Database structure
API documentation
Deployment instructions
Testing procedures
Security practices
Development workflow
Troubleshooting information
Git Practices

Changes should be committed using clear and descriptive commit messages.

Examples include:

Add supplier management
Update API documentation
Fix authentication validation
Add testing documentation

Large unrelated changes should be avoided in a single commit where possible.

##Maintainability

The project should remain simple and understandable throughout development.

Before making changes, existing functionality should be considered to avoid
introducing unnecessary regressions.

Future improvements should follow the existing project structure and should
include appropriate tests and documentation where necessary.

Code Quality Checklist
 Modular backend structure
 Clear naming conventions
 API validation
 Automated backend tests
 Error handling
 Database migrations
 Project documentation
 Clear Git commit messages
 Automated code formatting
 Static code analysis in CI
##Conclusion

Following consistent coding and documentation practices helps keep Selvage
maintainable and easier to test. The current practices are suitable for the
academic prototype while providing a foundation for future improvements.