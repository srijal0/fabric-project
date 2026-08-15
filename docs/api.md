# API Documentation

Selvage provides a REST API built with FastAPI for managing fabric catalogue
records, suppliers, authentication, images, and QR codes.

## Base API

The API is provided by the FastAPI backend.

Interactive API documentation is available through FastAPI's `/docs`
endpoint when the backend is running.

## Fabric Endpoints

### Get Fabrics

`GET /fabrics`

Returns a list of fabric records.

### Get One Fabric

`GET /fabrics/{id}`

Returns details of a specific fabric.

### Create Fabric

`POST /fabrics`

Creates a new fabric record. Authentication is required.

### Update Fabric

`PUT /fabrics/{id}`

Updates an existing fabric record. Authentication is required.

### Delete Fabric

`DELETE /fabrics/{id}`

Deletes a fabric record. Administrator privileges are required.

## Image Endpoint

### Upload Fabric Image

`POST /fabrics/{id}/image`

Uploads an image associated with a fabric record.

Authentication is required.

## QR Code Endpoint

### Generate QR Code

`GET /fabrics/{id}/qrcode`

Generates a QR code containing useful information about the selected fabric.

## Supplier Endpoints

The system provides endpoints for creating, viewing, and deleting supplier
records.

Supplier creation requires authentication, while supplier deletion requires
administrator privileges.

## Authentication

Authentication uses JWT tokens.

Users provide their credentials through the login endpoint. After successful
authentication, the API returns a JWT token that is used when accessing
protected endpoints.

## Roles

### Staff

Staff users can:

- View fabric records
- Add fabrics
- Edit fabrics
- Upload fabric images
- Manage suppliers

### Admin

Administrators have all staff permissions plus additional administrative
operations such as:

- Delete fabrics
- Delete suppliers

## Error Handling

The API uses standard HTTP status codes to indicate the result of requests.

Common responses include:

- `200` — Request successful
- `201` — Resource created
- `400` — Invalid request
- `401` — Authentication required or invalid credentials
- `403` — Insufficient permissions
- `404` — Resource not found
- `422` — Validation error

## Testing

The API is tested using pytest and FastAPI TestClient.

Tests cover authentication, fabric operations, permissions, image uploads,
supplier management, and QR code generation.