"""
Basic tests for the fabric catalog API.
Run with:  pytest test_api.py   (from inside the tests/ folder, backend on PYTHONPATH)

These use FastAPI's TestClient, so no server needs to be running —
each test gets a fresh in-memory-style flow against the real app.
"""
import sys
import os

# Make the backend package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi.testclient import TestClient
from main import app
from database import init_db

init_db()
client = TestClient(app)

SAMPLE_FABRIC = {
    "name": "Test Poplin",
    "sku": "TST-001",
    "category": "Cotton",
    "composition": "100% cotton",
    "color_name": "White",
    "color_hex": "#FFFFFF",
    "pattern": "Solid",
    "weight_gsm": 120,
    "width_cm": 150,
    "price_per_meter": 5.0,
    "stock_meters": 30,
    "supplier": "Test Mills",
    "season": "All-season",
    "usage": "Shirting",
    "care": "Machine wash cold.",
    "notes": ""
}


def test_list_fabrics_returns_200():
    res = client.get("/fabrics")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_create_get_update_delete_fabric():
    # Create
    res = client.post("/fabrics", json=SAMPLE_FABRIC)
    assert res.status_code == 200
    fabric = res.json()
    fabric_id = fabric["id"]
    assert fabric["name"] == "Test Poplin"

    # Get
    res = client.get(f"/fabrics/{fabric_id}")
    assert res.status_code == 200
    assert res.json()["sku"] == "TST-001"

    # Update
    res = client.patch(f"/fabrics/{fabric_id}", json={"stock_meters": 5})
    assert res.status_code == 200
    assert res.json()["stock_meters"] == 5

    # Delete
    res = client.delete(f"/fabrics/{fabric_id}")
    assert res.status_code == 200

    # Confirm gone
    res = client.get(f"/fabrics/{fabric_id}")
    assert res.status_code == 404


def test_get_nonexistent_fabric_returns_404():
    res = client.get("/fabrics/999999")
    assert res.status_code == 404


def test_stats_endpoint_returns_expected_keys():
    res = client.get("/stats")
    assert res.status_code == 200
    data = res.json()
    for key in ["total_fabrics", "total_stock_meters", "low_stock_count", "categories"]:
        assert key in data
