# Deployment Guide

## Overview

Selvage consists of a plain HTML, CSS, and JavaScript frontend and a FastAPI backend. The backend provides REST API endpoints for fabric management, supplier management, authentication, QR code generation, image uploads, statistics, and fabric similarity recommendations.

The backend can be deployed to a cloud hosting platform such as Render, while the frontend communicates with the backend through HTTP requests.

## Backend Deployment

The Selvage backend is deployed using Render for the thesis demonstration. The backend is developed using FastAPI and runs with Uvicorn.

The deployment requires the following environment variables:

* `DATABASE_URL` — database connection configuration
* `JWT_SECRET` — secret used to sign authentication tokens
* Any additional environment variables required by the application

Sensitive configuration values should be stored using the hosting platform's environment variable settings and should not be committed to the Git repository.

## Database

The current project uses SQLite as the database because Selvage is an academic prototype intended for demonstration and evaluation.

SQLite is suitable for local development and small-scale demonstrations. However, a production deployment would benefit from a managed relational database such as PostgreSQL to provide more reliable persistent storage, scalability, and database management.

## Frontend

The frontend is developed using plain HTML, CSS, and JavaScript.

It communicates with the FastAPI backend through REST API requests using the JavaScript `fetch()` API. Since the frontend does not use a framework-based build system, no JavaScript build process is required.

The frontend must be configured with the correct URL of the deployed backend API.

## CORS Configuration

The FastAPI backend uses Cross-Origin Resource Sharing (CORS) to allow the separately hosted frontend to communicate with the API.

During development and demonstration, broader CORS settings may be used. For a production deployment, CORS should be restricted to the trusted frontend domain rather than allowing requests from all origins.

## File Uploads

Fabric images can be uploaded through the backend API. The uploaded files are stored in the application's `uploads` directory and their paths are associated with the corresponding fabric records.

The current free-tier deployment may not provide permanent file storage. Therefore, a production version should use dedicated persistent object storage for fabric images.

## Machine Learning Deployment

The fabric similarity recommendation feature uses the Sentence Transformers library with the `all-MiniLM-L6-v2` pre-trained model.

When the backend starts, the model is loaded by the fabric similarity module. The required machine learning dependencies must therefore be included in the backend's dependency configuration.

The recommendation endpoint compares fabric descriptions using semantic embeddings and cosine similarity and returns up to five similar fabrics.

## Deployment Limitations

The current deployment is intended primarily for academic demonstration and evaluation.

Known limitations include:

* SQLite-based database storage
* Ephemeral or limited free-tier storage
* Limited cloud computing resources
* No production-grade API rate limiting
* Uploaded files are not stored using dedicated persistent object storage
* Machine learning model loading may require additional startup resources

These limitations do not prevent the main Selvage functionality from being demonstrated.

## Local Development

To run the backend locally, use:

```bash
uvicorn backend.main:app --reload
```

The FastAPI interactive API documentation is available through the `/docs` endpoint.

For example:

```text
http://127.0.0.1:8000/docs
```

The frontend can be opened using a local web server and configured to communicate with the local FastAPI backend.

## Production Improvements

For a future production deployment, the following improvements are recommended:

* Migrate from SQLite to a managed PostgreSQL database.
* Use persistent object storage for uploaded fabric images.
* Restrict CORS to trusted frontend domains.
* Add API rate limiting and stronger abuse protection.
* Configure application monitoring and structured logging.
* Implement automated deployment pipelines.
* Configure regular database backups.
* Use a production-grade hosting environment with sufficient resources for the machine learning model.
* Add health checks and monitoring for the deployed API.

## Deployment Verification

After deployment, the API should be tested through the FastAPI `/docs` interface and the frontend should be checked to ensure that it can communicate successfully with the deployed backend.

Important endpoints can be tested, including:

* `/auth/login`
* `/auth/me`
* `/fabrics`
* `/fabrics/{fabric_id}`
* `/fabrics/{fabric_id}/qrcode`
* `/fabrics/{fabric_id}/similar`
* `/suppliers`
* `/stats`

This verification helps confirm that authentication, fabric management, supplier management, QR generation, statistics, image handling, and machine learning recommendations are functioning correctly after deployment.
