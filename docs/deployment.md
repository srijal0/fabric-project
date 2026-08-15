# Deployment Guide

## Overview

Selvage consists of a plain HTML/CSS/JavaScript frontend and a FastAPI
backend. The backend can be deployed to a cloud hosting platform while the
frontend communicates with it through the REST API.

## Backend Deployment

The backend is deployed using Render for the thesis demonstration.

The backend application runs using FastAPI and Uvicorn.

The deployment requires the following environment variables:

- `DATABASE_URL` — database connection configuration
- `JWT_SECRET` — secret used to sign authentication tokens
- Any additional credentials required by the application

Sensitive values must be configured through the hosting platform's environment
settings and must not be committed to the repository.

## Database

The current deployment uses SQLite because the project is an academic
prototype.

SQLite is suitable for demonstration purposes but does not provide the
persistent storage expected from a production system on the current free-tier
deployment.

A production version could migrate to PostgreSQL or another managed
relational database.

## Frontend

The frontend is built using plain HTML, CSS, and JavaScript.

It communicates with the deployed FastAPI backend using HTTP requests through
the JavaScript `fetch()` API.

The frontend does not require a JavaScript build process.

## CORS

The backend allows cross-origin requests so that the separately hosted
frontend can communicate with the API.

For production use, CORS should be restricted to the exact frontend domain.

## File Uploads

Fabric images are uploaded through the backend API and stored in the
application's upload directory.

The current free-tier deployment has limited file persistence.

A production system should use dedicated object storage for uploaded images.

## Deployment Limitations

The current deployment is intended for academic demonstration and evaluation.

Known limitations include:

- SQLite-based storage
- Ephemeral free-tier storage
- Limited resources
- No production-grade rate limiting
- File uploads are not stored in dedicated persistent storage

These limitations do not affect the main functionality required for the
thesis demonstration.

## Local Development

To run the backend locally:

```bash
uvicorn backend.main:app --reload

```
The API documentation can then be accessed through the FastAPI /docs
endpoint.

The frontend can be opened through a local web server and configured to
communicate with the local backend.

##Production Improvements

For a future production deployment, the following improvements are
recommended:

Use a managed PostgreSQL database
Use persistent object storage for fabric images
Restrict CORS to trusted frontend domains
Add API rate limiting
Configure monitoring and logging
Use automated deployment pipelines
Configure regular database backups