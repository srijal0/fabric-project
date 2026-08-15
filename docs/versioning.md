# Versioning Guide

## Overview

Selvage uses Git for version control and maintains a clear history of
development changes. Versioning helps track project progress, identify
changes, and maintain stable versions of the thesis prototype.

## Git Repository

The project source code is maintained in a Git repository.

Git is used to:

- Track source code changes
- Record development history
- Identify completed features
- Restore earlier versions when required
- Support collaboration and project maintenance

## Commit Practices

Each significant change should be committed separately using a clear and
descriptive commit message.

Examples include:

- `Add supplier management`
- `Update database documentation`
- `Fix authentication validation`
- `Add testing guide`
- `Document deployment process`

Commit messages should briefly describe what was changed.

## Branching

The current thesis prototype uses the `main` branch as the primary
development branch.

Changes are committed and pushed to the repository after they have been
reviewed and tested.

For larger future development work, separate feature branches can be used
before merging changes into `main`.

## Release Preparation

Before preparing a stable project version, the following checks should be
completed:

- Run the backend test suite.
- Check that the application starts correctly.
- Verify authentication and authorization.
- Check database migrations.
- Verify important API endpoints.
- Check the frontend and backend communication.
- Review documentation.
- Confirm that sensitive information is not committed.

## Version Identification

Important project milestones can be identified using Git commits and tags.

Git tags may be introduced for major milestones such as:

- Thesis prototype completion
- Final testing completion
- Final submission version
- Demonstration release

Example:

```bash
git tag v1.0.0
git push origin v1.0.0

```
##Change Tracking

The project maintains a Git history containing changes to:

Application source code
Database models
API functionality
Authentication
Testing
Documentation
Deployment configuration

This history provides a record of how the project developed over time.

##Rollback

If a change introduces a problem, Git can be used to inspect previous
commits and restore an earlier working version.

Before reverting important changes, the affected functionality should be
identified and tested.

##Final Thesis Version

The final thesis version should represent a stable and tested state of the
application.

The final version should include:

Completed core functionality
Passing automated tests
Updated documentation
Security documentation
Deployment information
Clean repository status
Versioning Checklist
 Git repository configured
 Main development branch maintained
 Descriptive commit messages used
 Development history preserved
 Documentation changes tracked
 Testing changes tracked
 Release tags for final versions
 Automated release process
##Conclusion

Git provides a reliable way to track the development of Selvage and maintain
a history of project changes. Clear commits, testing, and release checks help
ensure that the final thesis version remains stable and reproducible.