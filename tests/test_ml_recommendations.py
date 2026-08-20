"""
Tests for the Machine Learning fabric similarity recommendation API.
"""

import sys
import os

sys.path.insert(
    0,
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "backend",
    ),
)

from fastapi.testclient import TestClient
from sqlmodel import Session, select

from main import app
from database import engine, init_db
from models import Fabric


# Create database tables
init_db()


def create_test_fabrics():
    """
    Create test fabrics if they do not already exist.
    """

    with Session(engine) as session:
        fabrics = session.exec(
            select(Fabric)
        ).all()

        # Check whether the required test fabric already exists
        target = next(
            (
                fabric
                for fabric in fabrics
                if fabric.name == "Sea Island Poplin"
            ),
            None,
        )

        if target:
            return target.id

        test_fabrics = [
            Fabric(
                name="Sea Island Poplin",
                sku="TEST001",
                category="Cotton",
                composition="100% Cotton",
                color_name="White",
                color_hex="#FFFFFF",
                pattern="Plain",
                weight_gsm=120,
                width_cm=150,
                price_per_meter=20,
                stock_meters=100,
                supplier="Test Supplier",
                season="Summer",
                usage="Shirts",
                care="Machine wash",
                notes="Test fabric",
            ),
            Fabric(
                name="Egyptian Cotton",
                sku="TEST002",
                category="Cotton",
                composition="100% Cotton",
                color_name="Blue",
                color_hex="#0000FF",
                pattern="Plain",
                weight_gsm=130,
                width_cm=150,
                price_per_meter=25,
                stock_meters=100,
                supplier="Test Supplier",
                season="Summer",
                usage="Shirts",
                care="Machine wash",
                notes="Test fabric",
            ),
            Fabric(
                name="Linen Blend",
                sku="TEST003",
                category="Linen",
                composition="55% Linen 45% Cotton",
                color_name="Beige",
                color_hex="#F5F5DC",
                pattern="Plain",
                weight_gsm=150,
                width_cm=145,
                price_per_meter=30,
                stock_meters=100,
                supplier="Test Supplier",
                season="Summer",
                usage="Dresses",
                care="Gentle wash",
                notes="Test fabric",
            ),
        ]

        session.add_all(test_fabrics)
        session.commit()

        session.refresh(test_fabrics[0])

        return test_fabrics[0].id


# Create test data
TEST_FABRIC_ID = create_test_fabrics()

client = TestClient(app)


def test_get_similar_fabrics_returns_recommendations():
    response = client.get(
        f"/fabrics/{TEST_FABRIC_ID}/similar"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["fabric_id"] == TEST_FABRIC_ID
    assert data["fabric_name"] == "Sea Island Poplin"

    assert "recommendations" in data
    assert isinstance(
        data["recommendations"],
        list,
    )

    for recommendation in data["recommendations"]:
        assert "id" in recommendation
        assert "name" in recommendation
        assert "sku" in recommendation
        assert "category" in recommendation
        assert "composition" in recommendation
        assert "similarity_score" in recommendation


def test_similar_fabrics_does_not_recommend_itself():
    response = client.get(
        f"/fabrics/{TEST_FABRIC_ID}/similar"
    )

    assert response.status_code == 200

    data = response.json()

    for recommendation in data["recommendations"]:
        assert recommendation["id"] != TEST_FABRIC_ID


def test_similar_fabrics_returns_maximum_five_recommendations():
    response = client.get(
        f"/fabrics/{TEST_FABRIC_ID}/similar"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["recommendations"]) <= 5


def test_similar_fabrics_returns_404_for_nonexistent_fabric():
    response = client.get(
        "/fabrics/99999/similar"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Fabric not found"