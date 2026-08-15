# Environment Configuration Guide

## Overview

Selvage uses environment variables to store configuration values that may
change between development and deployment environments.

Sensitive values such as authentication secrets should not be stored directly
in the source code or committed to Git.

## Local Environment

During local development, configuration values can be provided through a
`.env` file.

Example:

```env
DATABASE_URL=sqlite:///./fabrics.db
JWT_SECRET=your-development-secret

```
The actual values used by the developer should not be committed to the
repository.

##Secret Management

The following types of information should be treated as sensitive:

##JWT secret keys
Passwords
Authentication credentials
Database credentials
Deployment-specific secrets

These values should be supplied through environment variables.

##Git Protection

The .env file should remain excluded from version control.

Before committing changes, developers should check:

##git status

Sensitive configuration files must not appear as files ready to be committed.

##Deployment Configuration

The deployed backend uses environment variables configured in the deployment
environment.

This avoids storing production secrets inside the Git repository.

Configuration should be checked whenever the application is deployed or
updated.

##Changing Configuration

When a configuration value needs to be changed:

Update the local environment configuration.
Restart the development server if required.
Test the application.
Verify that sensitive values are not tracked by Git.
Deploy using the appropriate environment configuration.
Security Considerations

Environment variables improve security by separating sensitive configuration
from application source code.

However, environment variables must still be protected because anyone with
access to the deployment environment may potentially access their values.

##Secrets should never be placed in:

Source code
Documentation
Git commit messages
Screenshots
Public issue reports
Public repositories
Configuration Checklist
 Environment variables used for sensitive configuration
 JWT secrets excluded from source code
 .env excluded from Git tracking
 Deployment secrets configured separately
 Configuration documented
 Secret rotation procedure for production
 Dedicated production secret-management service
##Conclusion

Environment-based configuration keeps sensitive values separate from the
Selvage source code and allows the same application to use different
configuration values during development and deployment.