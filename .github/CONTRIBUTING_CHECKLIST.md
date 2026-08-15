# Contribution Checklist

Use this checklist before pushing changes to the Selvage repository.

## Before Making Changes

- [ ] Understand the purpose of the change.
- [ ] Check the existing project structure.
- [ ] Avoid changing unrelated files.
- [ ] Do not modify `fabric-catalog.html` unless the change specifically
      requires it.
- [ ] Do not commit passwords, tokens, API keys, or `.env` files.

## Development

- [ ] Follow the existing project structure.
- [ ] Use clear and descriptive names.
- [ ] Keep changes focused.
- [ ] Update documentation when required.
- [ ] Add or update tests for backend functionality.

## Testing

Run the backend test suite:

```bash
pytest tests/ -v

```
 All tests pass.
 Authentication behaviour has been checked.
 Role-based permissions have been checked.
 API changes have been tested.
 Database changes have been tested.
##Security
 No secrets are included in the commit.
 User passwords are never stored as plain text.
 Protected endpoints require authentication.
 Administrative operations require appropriate permissions.
 Uploaded file validation has been considered.
##Git
 Review git status.
 Review the files being committed.
 Use a clear commit message.
 Push only the intended changes.

##Example:

git status
git add <file>
git commit -m "Describe the change"
git push
Documentation

Update relevant documentation when changes affect:

API endpoints
Database structure
Authentication
Deployment
Testing
Security
Development workflow
Final Review

Before considering the change complete:

 Tests pass.
 No sensitive files are tracked.
 Documentation is updated where necessary.
 Git working tree is clean.
 Changes have been successfully pushed.