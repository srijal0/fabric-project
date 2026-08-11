"""
Tests for: (1) supplier CRUD endpoints, (2) QR code generation endpoint.

Relies on tests/conftest.py adding backend/ to sys.path and pointing
DATABASE_URL at a fresh, disposable SQLite file for this test run.
"""
import io

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from main import app
from database import get_session
from models import Fabric, Supplier, User
from auth import hash_password


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="admin_token")
def admin_token_fixture(session: Session, client: TestClient):
    admin = User(username="admin_user", hashed_password=hash_password("adminpass"), role="admin")
    session.add(admin)
    session.commit()

    response = client.post("/auth/login", data={"username": "admin_user", "password": "adminpass"})
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(name="staff_token")
def staff_token_fixture(session: Session, client: TestClient):
    staff = User(username="staff_user", hashed_password=hash_password("staffpass"), role="staff")
    session.add(staff)
    session.commit()

    response = client.post("/auth/login", data={"username": "staff_user", "password": "staffpass"})
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(name="sample_supplier")
def sample_supplier_fixture(session: Session):
    supplier = Supplier(name="Kurabo Textiles", contact_email="sales@kurabo.example", phone="555-0100")
    session.add(supplier)
    session.commit()
    session.refresh(supplier)
    return supplier


@pytest.fixture(name="sample_fabric")
def sample_fabric_fixture(session: Session):
    fabric = Fabric(name="Cotton Poplin", sku="CTN-001", category="Cotton", stock_meters=50)
    session.add(fabric)
    session.commit()
    session.refresh(fabric)
    return fabric


# ---------- Supplier CRUD tests ----------

def test_list_suppliers_returns_200(client: TestClient):
    response = client.get("/suppliers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_supplier_requires_login(client: TestClient):
    response = client.post("/suppliers", json={"name": "Unauthorized Co"})
    assert response.status_code == 401


def test_create_supplier_when_logged_in(client: TestClient, staff_token: str):
    response = client.post(
        "/suppliers",
        json={"name": "Emblem Linen Co.", "contact_email": "info@emblem.example", "phone": "555-0200"},
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Emblem Linen Co."
    assert body["id"] is not None


def test_get_supplier_by_id(client: TestClient, sample_supplier: Supplier):
    response = client.get(f"/suppliers/{sample_supplier.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Kurabo Textiles"


def test_get_nonexistent_supplier_returns_404(client: TestClient):
    response = client.get("/suppliers/99999")
    assert response.status_code == 404


def test_update_supplier_when_logged_in(client: TestClient, staff_token: str, sample_supplier: Supplier):
    response = client.patch(
        f"/suppliers/{sample_supplier.id}",
        json={"phone": "555-9999"},
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 200
    assert response.json()["phone"] == "555-9999"


def test_staff_cannot_delete_supplier(client: TestClient, staff_token: str, sample_supplier: Supplier):
    response = client.delete(
        f"/suppliers/{sample_supplier.id}",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 403


def test_admin_can_delete_supplier(client: TestClient, admin_token: str, sample_supplier: Supplier):
    response = client.delete(
        f"/suppliers/{sample_supplier.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_deleting_supplier_unlinks_fabrics_instead_of_breaking_them(
    client: TestClient, admin_token: str, session: Session, sample_supplier: Supplier, sample_fabric: Fabric
):
    # Link the fabric to the supplier first
    sample_fabric.supplier_id = sample_supplier.id
    session.add(sample_fabric)
    session.commit()

    response = client.delete(
        f"/suppliers/{sample_supplier.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200

    # The fabric should still exist and be fetchable, just unlinked
    get_response = client.get(f"/fabrics/{sample_fabric.id}")
    assert get_response.status_code == 200
    assert get_response.json()["supplier_id"] is None


# ---------- QR code tests ----------

def test_get_fabric_qrcode_returns_image(client: TestClient, sample_fabric: Fabric):
    response = client.get(f"/fabrics/{sample_fabric.id}/qrcode")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 0


def test_get_qrcode_for_nonexistent_fabric_returns_404(client: TestClient):
    response = client.get("/fabrics/99999/qrcode")
    assert response.status_code == 404