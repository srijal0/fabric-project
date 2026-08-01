"""
Tests for: (1) image upload endpoint, (2) admin-only delete restriction.

Relies on tests/conftest.py adding backend/ to sys.path so these imports work.
"""
import io
import os
import shutil

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from main import app, UPLOAD_DIR
from database import get_session
from models import Fabric, User
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

    # Clean up any files written to uploads/ during the test run.
    # ignore_errors=True because on Windows, TestClient/StaticFiles can
    # still hold a file handle open at teardown time — the cleanup is
    # best-effort, not something a test should fail over.
    if os.path.isdir(UPLOAD_DIR):
        shutil.rmtree(UPLOAD_DIR, ignore_errors=True)
        os.makedirs(UPLOAD_DIR, exist_ok=True)


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


@pytest.fixture(name="sample_fabric")
def sample_fabric_fixture(session: Session):
    fabric = Fabric(name="Cotton Poplin", sku="CTN-001", category="Cotton", stock_meters=50)
    session.add(fabric)
    session.commit()
    session.refresh(fabric)
    return fabric


# ---------- Image upload tests ----------

def test_upload_image_sets_image_path(client: TestClient, staff_token: str, sample_fabric: Fabric):
    fake_image = io.BytesIO(b"fake image bytes")
    response = client.post(
        f"/fabrics/{sample_fabric.id}/image",
        headers={"Authorization": f"Bearer {staff_token}"},
        files={"file": ("swatch.png", fake_image, "image/png")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["image_path"] is not None
    assert body["image_path"].startswith("/uploads/")
    assert body["image_path"].endswith(".png")


def test_upload_image_rejects_bad_extension(client: TestClient, staff_token: str, sample_fabric: Fabric):
    fake_file = io.BytesIO(b"not an image")
    response = client.post(
        f"/fabrics/{sample_fabric.id}/image",
        headers={"Authorization": f"Bearer {staff_token}"},
        files={"file": ("notes.txt", fake_file, "text/plain")},
    )
    assert response.status_code == 400


def test_upload_image_requires_auth(client: TestClient, sample_fabric: Fabric):
    fake_image = io.BytesIO(b"fake image bytes")
    response = client.post(
        f"/fabrics/{sample_fabric.id}/image",
        files={"file": ("swatch.png", fake_image, "image/png")},
    )
    assert response.status_code == 401


def test_upload_image_fabric_not_found(client: TestClient, staff_token: str):
    fake_image = io.BytesIO(b"fake image bytes")
    response = client.post(
        "/fabrics/99999/image",
        headers={"Authorization": f"Bearer {staff_token}"},
        files={"file": ("swatch.png", fake_image, "image/png")},
    )
    assert response.status_code == 404


# ---------- Admin-only delete tests ----------

def test_staff_cannot_delete_fabric(client: TestClient, staff_token: str, sample_fabric: Fabric):
    response = client.delete(
        f"/fabrics/{sample_fabric.id}",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 403


def test_admin_can_delete_fabric(client: TestClient, admin_token: str, sample_fabric: Fabric):
    response = client.delete(
        f"/fabrics/{sample_fabric.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_delete_requires_auth(client: TestClient, sample_fabric: Fabric):
    response = client.delete(f"/fabrics/{sample_fabric.id}")
    assert response.status_code == 401


def test_delete_nonexistent_fabric_returns_404(client: TestClient, admin_token: str):
    response = client.delete(
        "/fabrics/99999",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 404