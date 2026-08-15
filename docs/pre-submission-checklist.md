# Pre-Submission Checklist

## Application Functionality

- [ ] Fabric catalogue loads correctly
- [ ] Fabric search works
- [ ] Fabric filtering works
- [ ] Fabric sorting works
- [ ] New fabric can be added
- [ ] Existing fabric can be edited
- [ ] Fabric deletion works for administrators
- [ ] Fabric images can be uploaded
- [ ] Fabric images are displayed correctly
- [ ] Supplier management works
- [ ] QR code generation works
- [ ] QR codes can be downloaded
- [ ] Dashboard and analytics display correctly

## Authentication and Authorization

- [ ] Staff login works
- [ ] Invalid login credentials are rejected
- [ ] Protected operations require authentication
- [ ] Staff permissions are enforced
- [ ] Administrator permissions are enforced
- [ ] Non-admin users cannot perform administrator-only operations
- [ ] JWT secrets are stored through environment variables

## Backend

- [ ] FastAPI backend starts successfully
- [ ] API endpoints respond correctly
- [ ] Database connection works
- [ ] Alembic migrations are up to date
- [ ] Validation errors are handled correctly
- [ ] Missing resources return appropriate responses

## Testing

Run the complete test suite:

```bash
pytest tests/ -v

```
 All automated tests pass
 Authentication tests pass
 Permission tests pass
 Fabric CRUD tests pass
 Image upload tests pass
 Supplier tests pass
 QR code tests pass
 No known test failures remain
##Security
 .env is not tracked by Git
 Secrets are not present in source code
 Passwords are not stored as plain text
 JWT authentication is enabled
 Role-based authorization is enabled
 Security limitations are documented
 Production security improvements are documented
##Documentation
 README is up to date
 System architecture is documented
 Data model is documented
 API documentation is available
 Testing guide is available
 Deployment guide is available
 Security policy is available
 Development notes are updated
 Project progress log is updated
 Technology stack is documented
##GitHub Repository
 Repository has a clear README
 LICENSE is included
 SECURITY.md is included
 CONTRIBUTING.md is included
 CODEOWNERS is configured
 Issue templates are available
 Pull request template is available
 Dependabot configuration is available
 GitHub Actions workflow is working
 No unnecessary generated files are committed
##Deployment
 Backend deployment is accessible
 Frontend communicates with the deployed API
 Login works on the deployed system
 Fabric operations work on the deployed system
 Supplier management works
 QR code generation works
 Image upload works
 Deployment limitations are understood
##Final Review
 Project documentation matches the implemented system
 Git working tree is clean
 Latest changes have been pushed to GitHub
 Final application demonstration has been tested
 Thesis presentation materials are ready
 Viva questions have been reviewed