# Selvage — Fabric & Material Cataloging System

**Undergraduate Thesis Project**

> Design and Development of a Web-Based Fabric and Material Cataloging System for Efficient Fabric Inventory Management, Search, Stock Tracking, Supplier Management, QR-Based Identification, and Machine Learning-Based Fabric Similarity Recommendations.

A web-based inventory and cataloging system for clothing store fabrics and materials, built as an undergraduate thesis project. Selvage allows store staff to add, search, filter, manage, and track fabric information such as composition, GSM, price, supplier, colour, stock levels, and usage in one centralized system instead of relying on spreadsheets or physical swatch books.

**Live deployment:** https://fabric-project-08hi.onrender.com/docs

(free-tier hosting — see Deployment notes below)


## Architecture

```text
frontend/   -> Static HTML/CSS/JavaScript catalog UI
backend/    -> Python FastAPI REST API + SQLite database + Alembic migrations
backend/ml/ -> Machine Learning fabric similarity and recommendation module
tests/      -> Automated backend API tests
docs/       -> Diagrams, notes, and thesis documentation material
```

The frontend and backend are separate applications that communicate over HTTP through REST API endpoints. The backend manages authentication, fabric and supplier data, image uploads, QR code generation, analytics, and machine learning recommendations.

The ML component is integrated into the backend and uses existing fabric catalogue information to generate similarity-based recommendations.

## Project Structure

```text
fabric-project/
├── backend/
│   ├── ml/                    # Machine Learning similarity module
│   │   ├── __init__.py
│   │   └── fabric_similarity.py
│   ├── main.py                # FastAPI application and API endpoints
│   ├── models.py              # Database models
│   ├── database.py             # Database configuration
│   ├── auth.py                 # Authentication and authorization
│   ├── requirements.txt        # Python dependencies
│   └── ...
├── frontend/
│   ├── js/
│   │   └── ml.js              # Frontend ML recommendation logic
│   ├── fabric-catalog.html     # Main catalog interface
│   ├── app.js                  # Main frontend functionality
│   └── styles.css              # Application styling
├── tests/                      # Automated backend tests
├── docs/                       # Architecture and project documentation
├── .github/                    # GitHub Actions workflows
├── README.md                   # Project overview and setup guide
├── CHANGELOG.md                # Record of project changes
├── CONTRIBUTING.md             # Contribution guidelines
└── SECURITY.md                 # Security information and reporting
```

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

### Frontend

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**
* **Fetch API** for communication with the FastAPI backend

### Machine Learning

* **Sentence Transformers** — used to generate semantic embeddings from fabric information
* **all-MiniLM-L6-v2** — pretrained Sentence Transformer model used for fabric similarity
* **Scikit-learn** — used for similarity calculations
* Fabric attributes are combined into a descriptive representation before being processed by the ML model.
* The generated embeddings are compared against other fabrics to identify semantically similar materials.

### Data Model

The main data entities are:

* **Fabric** — stores fabric identification, SKU, category, composition, physical properties, colour, pattern, weight, width, price, stock, season, usage, care information, supplier, and image.
* **Supplier** — stores supplier name, contact email, phone, and notes.
* **User** — stores staff/admin accounts and role information.

### Testing and CI

* **pytest**
* **FastAPI TestClient**
* Automated GitHub Actions CI
* Tests cover CRUD operations, authentication, permissions, image upload, supplier management, and QR generation.

### Deployment

* Backend deployed on **Render**
* Deployment is connected to the `main` branch
* GitHub Actions is used for automated validation

## Machine Learning Fabric Recommendation

Selvage includes a Machine Learning-based fabric similarity feature to provide intelligent recommendations from the existing fabric catalogue.

### How it works

When a user selects a fabric, the system collects relevant information such as:

* Fabric name
* Category
* Composition
* Colour
* Pattern
* Weight/GSM
* Width
* Season
* Usage
* Care instructions

These attributes are combined into a text representation of the fabric.

The **all-MiniLM-L6-v2** Sentence Transformer model converts the fabric description into a numerical embedding. The system then compares the selected fabric's embedding with the embeddings of other fabrics.

A similarity score is calculated for each comparison, and the system returns the most similar fabrics as recommendations.

### Example

For a selected fabric such as **Sea Island Poplin**, the system can return recommendations such as:

```json
{
  "fabric_id": 1,
  "fabric_name": "Sea Island Poplin",
  "recommendations": [
    {
      "id": 2,
      "name": "Vintage Rinse Denim",
      "sku": "DEN-VRD-204",
      "category": "Denim",
      "composition": "98% cotton, 2% elastane",
      "similarity_score": 0.4688
    },
    {
      "id": 5,
      "name": "Merino Flannel",
      "sku": "WOO-MER-582",
      "category": "Wool",
      "composition": "100% merino wool",
      "similarity_score": 0.4545
    },
    {
      "id": 4,
      "name": "Mulberry Charmeuse",
      "sku": "SIL-MUL-450",
      "category": "Silk",
      "composition": "100% silk",
      "similarity_score": 0.3799
    }
  ]
}
```

The similarity score represents how closely the system considers the fabric descriptions to be related based on their semantic embeddings.

### ML API Endpoint

The backend exposes a similarity recommendation endpoint:

```text
GET /fabrics/{fabric_id}/similar
```

For example:

```text
GET /fabrics/3/similar
```

The endpoint returns the selected fabric and a ranked list of similar fabrics.

### Frontend Integration

The ML recommendation functionality is also integrated into the fabric catalogue interface.

The frontend:

1. Displays the available fabrics.
2. Allows the user to select a fabric.
3. Sends a request to the similarity API.
4. Receives the ML recommendations.
5. Displays recommended fabrics and their similarity scores.

The frontend ML functionality is implemented in:

```text
frontend/js/ml.js
```

The recommendation interface is integrated into:

```text
frontend/fabric-catalog.html
```

## Running It Locally

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python seed.py
uvicorn main:app --reload
```

The API will normally start at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 2. Frontend

Open:

```text
frontend/fabric-catalog.html
```

in a browser.

For local development, the frontend can also be served using Python's built-in HTTP server:

```bash
cd frontend
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/fabric-catalog.html
```

The frontend communicates with the FastAPI backend through the configured API base URL.

### 3. Machine Learning Dependencies

The ML functionality requires the dependencies listed in:

```text
backend/requirements.txt
```

The important ML dependencies are:

```text
sentence-transformers==3.2.1
scikit-learn==1.3.2
```

The first execution of the Sentence Transformer model may require downloading the pretrained model.

### 4. Running Tests

```bash
cd backend
pytest tests/ -v
```

## Features

### Fabric Management

* Full CRUD for fabrics
* Add new fabric records
* View fabric details
* Edit fabric information
* Delete fabrics
* Search by name, SKU, supplier, or composition
* Filter by category
* Sort by name, price, stock, or date added
* Low-stock detection below 20 metres
* Dashboard statistics

### Authentication and Authorization

* Staff authentication
* JWT-based login
* Password hashing
* Role-based access control
* `admin` and `staff` roles
* Only administrators can delete fabrics and suppliers
* Staff users can view, add, and edit fabric records

### Fabric Images

* Upload fabric/swatches images
* Supported image formats include JPG, JPEG, PNG, WebP, and GIF
* Uploaded images are stored and served through the backend
* Fabric cards display uploaded images
* Fabric colour is used as a fallback when an image is unavailable

### QR Codes

* Generate QR codes for individual fabrics
* QR codes contain fabric information including:

  * Name
  * SKU
  * Category
  * Composition
  * Supplier
* QR codes can be generated on demand for physical fabric rolls

### Supplier Management

* Create suppliers
* View suppliers
* Edit supplier information
* Delete suppliers
* Link fabrics with suppliers
* Safely unlink fabrics when a supplier is deleted

### Machine Learning Recommendations

* Semantic fabric similarity analysis
* Automatic fabric recommendations
* Sentence Transformer embeddings
* `all-MiniLM-L6-v2` pretrained model
* Similarity scoring
* Ranked recommended fabrics
* ML recommendation API endpoint
* Frontend recommendation interface
* Uses existing fabric catalogue data rather than requiring a separate recommendation dataset

### Automated Testing and CI

* Automated backend tests
* API testing using FastAPI TestClient
* Authentication and authorization testing
* CRUD testing
* Image upload testing
* Supplier management testing
* QR code generation testing
* GitHub Actions CI
* Dependency validation during CI

### Live Deployment

* Backend hosted on Render
* Automatic deployment from the `main` branch
* Public API documentation available through the deployed FastAPI `/docs` endpoint

## API Overview

Important API endpoints include:

```text
POST   /auth/login
GET    /auth/me

GET    /fabrics
POST   /fabrics
GET    /fabrics/{fabric_id}
PATCH  /fabrics/{fabric_id}
DELETE /fabrics/{fabric_id}

POST   /fabrics/{fabric_id}/image
GET    /fabrics/{fabric_id}/qrcode
GET    /fabrics/{fabric_id}/similar

GET    /suppliers
POST   /suppliers
GET    /suppliers/{supplier_id}
PATCH  /suppliers/{supplier_id}
DELETE /suppliers/{supplier_id}

GET    /stats
```

## Deployment Notes

The live deployment runs on Render's free tier, which uses **non-persistent storage**. The SQLite database and uploaded images can reset when the server restarts or spins down after inactivity.

This is an accepted and disclosed limitation of the free-tier demonstration deployment rather than a defect in the application.

For a production deployment, the system could use a managed database such as PostgreSQL together with dedicated persistent file storage.

## Current Status

The core Selvage system has been implemented with:

* Fabric inventory and catalog management
* Supplier management
* Authentication and role-based authorization
* Fabric image uploads
* QR code generation
* Dashboard statistics
* Search and filtering
* Low-stock monitoring
* Machine Learning-based fabric similarity recommendations
* Frontend ML recommendation interface
* REST API integration
* Automated backend testing
* GitHub Actions CI
* Render deployment

The Machine Learning component extends the original catalogue system by providing an intelligent way to discover related fabrics based on the semantic similarity of their recorded characteristics.

## Future Improvements

Potential future improvements include:

* Supplier-level reporting and analytics
* More advanced fabric recommendation models
* Recommendation evaluation using user feedback
* Larger and more diverse fabric datasets
* Recommendation history
* Advanced inventory forecasting
* Point-of-sale integration
* Multi-location stock synchronization
* Automated frontend testing
* Persistent production database and file storage
* Model fine-tuning using domain-specific fabric datasets
* Recommendation performance evaluation using metrics such as Precision@K and Recall@K
