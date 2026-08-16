# Release Checklist

## Before Release

- [ ] Confirm the application starts correctly.
- [ ] Run the complete backend test suite.
- [ ] Confirm all tests pass.
- [ ] Review recent Git commits.
- [ ] Check that no `.env` files or secrets are committed.
- [ ] Review database migrations.
- [ ] Verify API endpoints.
- [ ] Check frontend and backend integration.
- [ ] Review security considerations.
- [ ] Update project documentation.

## Documentation

- [ ] Update `README.md` if required.
- [ ] Update `CHANGELOG.md`.
- [ ] Update API documentation if endpoints changed.
- [ ] Update deployment documentation if deployment settings changed.
- [ ] Update testing documentation if the test suite changed.

## Database

- [ ] Confirm all required Alembic migrations are committed.
- [ ] Verify the database schema is up to date.
- [ ] Confirm migrations can be applied successfully.

## Testing

Run:

```bash
pytest tests/ -v

```
Confirm that:

 Fabric operations work correctly.
 Supplier operations work correctly.
 Authentication works correctly.
 Role-based permissions work correctly.
 Image uploads work correctly.
 QR code generation works correctly.
 
##Security
 JWT secrets are stored in environment variables.
 No passwords or credentials are committed.
 Debug mode is disabled in deployment.
 Production CORS settings are reviewed.
 Known security limitations are documented.

##GitHub
 GitHub Actions completes successfully.
 Issues and pull requests are properly configured.
 The repository working tree is clean.
 The final commit is pushed to main.

##Final Verification
 Application is accessible.
 Main features have been manually checked.
 Documentation is complete.
 Changelog is updated.
 Project is ready for academic submission.