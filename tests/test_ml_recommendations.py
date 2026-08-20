"""
Tests for the Machine Learning fabric similarity recommendation API.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_similar_fabrics_returns_recommendations():
    response = client.get("/fabrics/1/similar")

    assert response.status_code == 200

    data = response.json()

    assert data["fabric_id"] == 1
    assert data["fabric_name"] == "Sea Island Poplin"
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)

    for recommendation in data["recommendations"]:
        assert "id" in recommendation
        assert "name" in recommendation
        assert "sku" in recommendation
        assert "category" in recommendation
        assert "composition" in recommendation
        assert "similarity_score" in recommendation


def test_similar_fabrics_does_not_recommend_itself():
    response = client.get("/fabrics/1/similar")

    assert response.status_code == 200

    data = response.json()

    for recommendation in data["recommendations"]:
        assert recommendation["id"] != 1


def test_similar_fabrics_returns_maximum_five_recommendations():
    response = client.get("/fabrics/1/similar")

    assert response.status_code == 200

    data = response.json()

    assert len(data["recommendations"]) <= 5


def test_similar_fabrics_returns_404_for_nonexistent_fabric():
    response = client.get("/fabrics/99999/similar")

    assert response.status_code == 404
    assert response.json()["detail"] == "Fabric not found"