# Selvage — Fabric & Material Cataloging System

**Undergraduate Thesis Project**

> Design and Development of a Web-Based Fabric and Material Cataloging System for Efficient Fabric Inventory Management, Search, Stock Tracking, Supplier Management, QR-Based Identification, and Machine Learning-Based Fabric Similarity Recommendations.

A web-based inventory and cataloging system for clothing store fabrics and materials, built as an undergraduate thesis project. Selvage allows store staff to add, search, filter, manage, and track fabric information such as composition, GSM, price, supplier, colour, stock levels, and usage in one centralized system instead of relying on spreadsheets or physical swatch books.

**Live deployment:** https://fabric-project-08hi.onrender.com/docs

*(Free-tier hosting — see Deployment Notes below.)*

---

## Architecture

```text
frontend/   -> Static HTML/CSS/JavaScript catalog UI
backend/    -> Python FastAPI REST API + SQLite database
backend/ml/ -> Machine Learning fabric similarity and recommendation module
tests/      -> Automated backend API tests
docs/       -> Architecture and project documentation
```

The frontend and backend are separate applications that communicate over HTTP through REST API endpoints.

The backend manages:

* Authentication and authorization
* Fabric catalogue management
* Supplier management
* Fabric image uploads
* QR code generation
* Stock tracking
* Catalogue statistics
* Machine learning-based fabric similarity recommendations

The ML component is integrated into the backend and uses existing fabric catalogue information to generate similarity-based recommendations.

---

## Project Structure

```text
fabric-project/
├── backend/
│   ├── ml/
│   │   ├── __init__.py
│   │   └── fabric_similarity.py    # ML similarity module
│   ├── main.py                      # FastAPI application and API endpoints
│   ├── models.py                    # SQLModel database models
│   ├── database.py                  # Database configuration
│   ├── auth.py                      # Authentication and authorization
│   ├── requirements.txt             # Python dependencies
│   └── ...
│
├── frontend/
│   ├── js/
│   │   └── ml.js                    # Frontend ML recommendation logic
│   ├── fabric-catalog.html          # Main catalogue interface
│   ├── app.js                       # Main frontend functionality
│   └── styles.css                   # Application styling
│
├── tests/                           # Automated backend tests
├── docs/                            # Architecture and project documentation
├── uploads/                         # Uploaded fabric images
├── .github/                         # GitHub Actions workflows
├── README.md                        # Project overview and setup guide
├── CHANGELOG.md                     # Record of project changes
├── CONTRIBUTING.md                  # Contribution guidelines
└── SECURITY.md                      # Security information and reporting
```

---

## Tech Stack

### Backend

* **Python**
* **FastAPI** — REST API framework
* **SQLModel** — database models and data validation
* **SQLite** — relational database
* **Alembic** — database migrations
* **python-jose** — JWT authentication
* **Passlib** — password hashing
* **qrcode[pil]** — QR code generation
* **Uvicorn** — ASGI server

### Machine Learning

* **Sentence Transformers**
* **all-MiniLM-L6-v2** — pre-trained sentence embedding model
* **Scikit-learn**
* **Cosine Similarity**

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript**
* **Fetch API**

### Development and Testing

* **pytest**
* **FastAPI TestClient**
* **Git**
* **GitHub**

### Deployment

* **Render**

---

## Core Features

### 1. Fabric Catalogue Management

The system provides complete CRUD functionality for fabrics.

Users can:

* Add new fabrics
* View fabric details
* Search fabrics
* Filter fabrics by category
* Filter low-stock fabrics
* Update fabric information
* Delete fabrics
* View stock information
* Store supplier information
* Record fabric composition and usage

Fabric information includes:

* Fabric name
* SKU
* Category
* Composition
* Colour name
* Colour HEX value
* Pattern
* Weight in GSM
* Width in centimetres
* Price per metre
* Stock in metres
* Supplier
* Season
* Usage
* Care instructions
* Notes

---

## 2. Search and Filtering

The catalogue provides search and filtering functionality to make fabric information easier to locate.

Users can search using:

* Fabric name
* SKU
* Supplier
* Composition

Fabrics can also be filtered by:

* Category
* Stock level

The low-stock filter helps staff identify fabrics that require attention or replenishment.

---

## 3. Supplier Management

Selvage provides supplier management functionality.

Users can:

* Add suppliers
* View suppliers
* View individual supplier information
* Update supplier details
* Delete suppliers
* Link fabrics with suppliers

Supplier information includes:

* Supplier name
* Contact email
* Phone number
* Notes
* Date added

When a supplier is deleted, linked fabrics are unlinked rather than automatically deleted.

---

## 4. Authentication and Authorization

The backend uses JWT-based authentication.

The system supports two roles:

* **Staff**
* **Admin**

Authentication includes:

* Username and password login
* Password hashing
* JWT access tokens
* Current-user endpoint
* Role-based authorization

Administrative operations are protected using role-based access control.

For example, deleting fabrics and suppliers requires administrator privileges.

---

## 5. Fabric Image Upload

Selvage allows users to upload images for individual fabrics.

Supported image formats include:

* JPG
* JPEG
* PNG
* WEBP
* GIF

Uploaded images are stored in the application's `uploads/` directory and are made available through the backend's `/uploads` endpoint.

Each uploaded image is given a unique filename using UUID generation to reduce filename conflicts.

---

## 6. QR Code Generation

Each fabric can have a dynamically generated QR code.

The QR code contains important fabric identification information:

```text
Selvage Fabric Catalog
Name: Fabric Name
SKU: Fabric SKU
Category: Fabric Category
Composition: Fabric Composition
Supplier: Fabric Supplier
```

The QR code endpoint is:

```text
GET /fabrics/{fabric_id}/qrcode
```

Example:

```text
GET /fabrics/1/qrcode
```

The endpoint returns the QR code as a PNG image.

---

# Machine Learning Recommendation System

## Overview

Selvage includes a machine learning-based fabric similarity recommendation feature.

The purpose of this feature is to recommend fabrics that are semantically similar to a selected fabric.

Instead of relying only on exact category or composition matching, the system creates a text representation of each fabric and uses a pre-trained Sentence Transformer model to generate semantic embeddings.

---

## Machine Learning Model

The system uses:

```text
all-MiniLM-L6-v2
```

from Sentence Transformers.

The model converts the textual representation of fabric information into numerical embedding vectors.

The following information is used to create the fabric text representation:

* Fabric name
* Category
* Composition
* Colour
* Pattern
* Weight
* Usage
* Season
* Care
* Supplier

The resulting embeddings are compared using cosine similarity.

---

## Recommendation Process

The recommendation process follows these steps:

```text
User selects a fabric
        ↓
Backend retrieves the selected fabric
        ↓
Fabric information is converted into text
        ↓
Sentence Transformer generates embedding
        ↓
Other fabrics are converted into embeddings
        ↓
Cosine similarity is calculated
        ↓
Results are sorted by similarity
        ↓
Top five similar fabrics are returned
```

The selected fabric itself is excluded from the recommendation results.

---

## Machine Learning API

The similarity endpoint is:

```text
GET /fabrics/{fabric_id}/similar
```

Example:

```text
GET /fabrics/1/similar
```

Example response:

```json
{
  "fabric_id": 1,
  "fabric_name": "Sea Island Poplin",
  "recommendations": [
    {
      "id": 2,
      "name": "Premium Cotton",
      "sku": "FAB-002",
      "category": "Cotton",
      "composition": "100% Cotton",
      "similarity_score": 0.8124
    }
  ]
}
```

Each recommendation contains:

* Fabric ID
* Fabric name
* SKU
* Category
* Composition
* Similarity score

The API returns a maximum of five recommendations.

---

# API Endpoints

## Authentication

| Method | Endpoint      | Description                           |
| ------ | ------------- | ------------------------------------- |
| POST   | `/auth/login` | Authenticate a user                   |
| GET    | `/auth/me`    | Return the current authenticated user |

## Fabrics

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| GET    | `/fabrics`              | List fabrics                            |
| GET    | `/fabrics/{id}`         | Get a specific fabric                   |
| POST   | `/fabrics`              | Create a fabric                         |
| PATCH  | `/fabrics/{id}`         | Update a fabric                         |
| DELETE | `/fabrics/{id}`         | Delete a fabric                         |
| POST   | `/fabrics/{id}/image`   | Upload a fabric image                   |
| GET    | `/fabrics/{id}/qrcode`  | Generate a fabric QR code               |
| GET    | `/fabrics/{id}/similar` | Generate similar fabric recommendations |

## Suppliers

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/suppliers`      | List suppliers          |
| GET    | `/suppliers/{id}` | Get a specific supplier |
| POST   | `/suppliers`      | Create a supplier       |
| PATCH  | `/suppliers/{id}` | Update a supplier       |
| DELETE | `/suppliers/{id}` | Delete a supplier       |

## Statistics

| Method | Endpoint | Description                 |
| ------ | -------- | --------------------------- |
| GET    | `/stats` | Return catalogue statistics |

---

# Statistics and Analytics

The `/stats` endpoint provides basic catalogue statistics.

The response includes:

* Total number of fabrics
* Total stock in metres
* Number of low-stock fabrics
* Number of fabric categories

Example:

```json
{
  "total_fabrics": 25,
  "total_stock_meters": 1250,
  "low_stock_count": 4,
  "categories": 8
}
```

These statistics provide a quick overview of the current fabric inventory.

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/srijal0/fabric-project.git
cd fabric-project
```

## 2. Create a Virtual Environment

On Windows:

```bash
python -m venv venv
```

Activate the environment:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

## 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

If the project is configured to use a root-level requirements file, use:

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file for environment-specific configuration.

Example:

```env
DATABASE_URL=sqlite:///./fabrics.db
JWT_SECRET=your-secret-key
CORS_ORIGINS=*
```

The actual secret values should not be committed to GitHub.

The `.env` file should remain excluded through `.gitignore`.

---

# Database

Selvage currently uses SQLite as the database for the academic prototype.

The database is configured through:

```env
DATABASE_URL=sqlite:///./fabrics.db
```

SQLModel is used to define the database models and interact with the database.

The project also includes Alembic for database migration management.

For a future production deployment, the database could be migrated to PostgreSQL or another managed relational database.

---

# Running the Backend

From the project root, run:

```bash
uvicorn backend.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# Running the Frontend

The frontend uses plain HTML, CSS, and JavaScript.

There is no JavaScript build process required.

The frontend can be opened through a local web server and configured to communicate with the FastAPI backend through its REST API.

The frontend uses the JavaScript `fetch()` API to communicate with backend endpoints.

---

# Testing

Selvage uses **pytest** for automated backend testing.

The tests are located in:

```text
tests/
```

To run the complete test suite from the project root:

```bash
pytest tests/ -v
```

The test suite covers functionality including:

* Fabric API endpoints
* Machine learning recommendations
* Similarity recommendation limits
* Preventing self-recommendation
* Handling non-existent fabrics
* Supplier functionality
* Supplier updates
* QR code generation
* Authentication-related functionality
* Other backend API functionality

## Current Test Result

The complete test suite has been successfully executed with:

```text
30 passed, 8 warnings
```

The tests completed successfully with no failed tests.

The current warnings are dependency or API deprecation warnings and do not cause the test suite to fail.

---

# Deployment

The backend is deployed using **Render** for thesis demonstration purposes.

Live API documentation:

```text
https://fabric-project-08hi.onrender.com/docs
```

The deployment configuration and limitations are documented in:

```text
docs/deployment.md
```

The current deployment is intended for academic demonstration rather than production use.

---

# Deployment Limitations

The current deployment uses a free-tier hosting environment.

Known limitations include:

* SQLite-based storage
* Limited persistent storage
* Uploaded files stored in the application environment
* Limited computing resources
* No production-grade API rate limiting
* Free-tier service availability limitations

These limitations do not prevent the main functionality of the system from being demonstrated.

---

# CORS

The backend includes CORS configuration to allow the separately hosted frontend to communicate with the FastAPI API.

The configuration can be controlled through:

```env
CORS_ORIGINS=*
```

For production deployment, CORS should be restricted to trusted frontend domains rather than allowing all origins.

---

# Security

The project includes several security-related features:

* JWT authentication
* Password hashing
* Role-based authorization
* Protected authenticated endpoints
* Admin-only operations
* Environment variables for sensitive configuration
* CORS configuration
* Image file-extension validation
* Unique filenames for uploaded images

Sensitive credentials such as JWT secrets should never be committed to the repository.

For more information, see:

```text
SECURITY.md
```

---

# Current Limitations

The current version is primarily designed for academic demonstration and evaluation.

Known limitations include:

* SQLite is used instead of a managed production database
* File uploads are stored locally
* Free-tier deployment has limited persistence
* No production-grade API rate limiting
* CORS should be restricted for production
* Machine learning embeddings are generated during recommendation requests
* The current recommendation system is based on semantic similarity rather than user-specific behavioural data

---

# Future Improvements

Potential improvements for a production version include:

* Migration from SQLite to PostgreSQL
* Persistent cloud object storage for fabric images
* API rate limiting
* Improved monitoring and logging
* Automated CI/CD deployment
* Regular database backups
* Caching of machine-learning embeddings
* More advanced recommendation algorithms
* Improved search functionality
* Advanced inventory analytics
* Production-level security hardening
* More detailed user activity tracking

---

# Development Documentation

The repository contains additional documentation:

```text
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
docs/
```

These files provide information about project changes, contribution guidelines, security considerations, deployment, and other project documentation.

---

# GitHub Repository

**Repository:**

https://github.com/srijal0/fabric-project

**Live API:**

https://fabric-project-08hi.onrender.com/docs

---

# Academic Project

Selvage was developed as an undergraduate thesis project to demonstrate the design and implementation of a web-based fabric and material cataloging system.

The system combines traditional inventory management functionality with QR-based fabric identification and machine-learning-based fabric similarity recommendations to provide a centralized platform for managing fabric information.

The project demonstrates the application of:

* Web application development
* REST API development
* Database management
* Authentication and authorization
* Inventory management
* QR code technology
* Machine learning
* Automated software testing
* Cloud deployment
