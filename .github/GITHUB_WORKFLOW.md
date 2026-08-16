# GitHub Workflow Guide

## Overview

This document describes the GitHub workflow used for the Selvage project.

## Branches

The project uses the `main` branch as the primary development branch.

Changes should be tested before being pushed to the repository.

## Commits

Commits should describe a single logical change.

Examples:

- `Add API documentation`
- `Fix supplier deletion logic`
- `Update testing documentation`
- `Add security testing practices`

## Issues

GitHub Issues are used to report bugs, suggest improvements, and track
development tasks.

Bug reports should include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behaviour
- Actual behaviour
- Relevant screenshots or error messages

Feature requests should explain:

- The proposed feature
- Why it would be useful
- Any relevant implementation considerations

## Pull Requests

Pull requests should:

1. Explain what was changed.
2. Explain why the change was required.
3. Include relevant testing information.
4. Confirm that existing tests continue to pass.

## Code Review

Changes should be reviewed before being merged when working with
multiple contributors.

Reviewers should check:

- Code quality
- Functionality
- Security considerations
- Test coverage
- Documentation

## Continuous Integration

GitHub Actions runs the automated backend test suite.

Changes should only be considered complete when the relevant tests pass.

## Documentation

Documentation should be updated when a change affects:

- API behaviour
- Database structure
- Security
- Deployment
- Testing
- Development workflow

## Before Submission

Before submitting the project, verify that:

- The application runs correctly.
- Backend tests pass.
- Documentation is up to date.
- No sensitive credentials are committed.
- GitHub Actions completes successfully.
- The working tree is clean.