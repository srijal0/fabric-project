# Continuous Integration Guide

## Overview

Selvage uses GitHub Actions to automatically run backend tests when changes
are pushed to the repository.

The purpose of continuous integration is to detect errors and regressions
early during development.

## Automated Checks

The CI process runs the backend test suite using pytest.

The automated checks verify important application functionality including:

- Fabric CRUD operations
- Authentication
- Role-based authorization
- Supplier management
- Image uploads
- QR code generation

## Workflow

The general CI process is:

1. A developer makes changes to the project.
2. Changes are committed to Git.
3. Changes are pushed to the GitHub repository.
4. GitHub Actions starts the configured workflow.
5. Project dependencies are installed.
6. Backend tests are executed.
7. The workflow reports whether the tests passed or failed.

## Local Testing

Developers should also run the test suite locally before pushing changes:

```bash
pytest tests/ -v

```
Running tests locally helps identify problems before they reach the
repository.

##Failed Builds

If a GitHub Actions workflow fails:

Open the failed workflow run.
Review the error message.
Identify the failing test or configuration problem.
Fix the issue locally.
Run the tests again.
Commit and push the fix.
Development Benefits

##Continuous integration helps the project by:

Detecting regressions automatically.
Verifying backend functionality after changes.
Providing consistent test execution.
Improving confidence before deployment.
Maintaining a reliable development history.
##CI Checklist
 GitHub Actions workflow configured
 Automated backend tests available
 Tests run after repository changes
 Authentication tests included
 Authorization tests included
 Supplier tests included
 Image upload tests included
 QR code tests included
 Additional security scanning for production
 Automated deployment approval process
##Conclusion

GitHub Actions provides an automated quality check for the Selvage project.
Combined with local testing and code review, continuous integration helps
maintain a stable and reliable thesis prototype.



