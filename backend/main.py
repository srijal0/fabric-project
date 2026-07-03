import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from database import init_db, get_session
from models import Fabric, FabricCreate, FabricUpdate, User
from auth import authenticate_user, create_access_token, get_current_user

app = FastAPI(title="Selvage — Fabric & Material Catalog API")

cors_origins = os.getenv("CORS_ORIGINS", "*")
origins = ["*"] if cors_origins.strip() == "*" else [o.strip() for o in cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "username": user.username, "role": user.role}


@app.get("/auth/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "role": current_user.role}


@app.get("/fabrics", response_model=List[Fabric])
def list_fabrics(
    category: Optional[str] = None,
    search: Optional[str] = None,
    low_stock_below: Optional[float] = None,
    session: Session = Depends(get_session),
):
    query = select(Fabric)
    if category and category != "All":
        query = query.where(Fabric.category == category)
    fabrics = session.exec(query).all()

    if search:
        s = search.lower()
        fabrics = [
            f for f in fabrics
            if s in f.name.lower() or s in f.sku.lower()
            or s in f.supplier.lower() or s in f.composition.lower()
        ]
    if low_stock_below is not None:
        fabrics = [f for f in fabrics if f.stock_meters < low_stock_below]

    return fabrics


@app.get("/fabrics/{fabric_id}", response_model=Fabric)
def get_fabric(fabric_id: int, session: Session = Depends(get_session)):
    fabric = session.get(Fabric, fabric_id)
    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    return fabric


@app.post("/fabrics", response_model=Fabric)
def create_fabric(
    fabric: FabricCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_fabric = Fabric.from_orm(fabric)
    session.add(db_fabric)
    session.commit()
    session.refresh(db_fabric)
    return db_fabric


@app.patch("/fabrics/{fabric_id}", response_model=Fabric)
def update_fabric(
    fabric_id: int,
    updates: FabricUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    fabric = session.get(Fabric, fabric_id)
    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(fabric, key, value)
    session.add(fabric)
    session.commit()
    session.refresh(fabric)
    return fabric


@app.delete("/fabrics/{fabric_id}")
def delete_fabric(
    fabric_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    fabric = session.get(Fabric, fabric_id)
    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    session.delete(fabric)
    session.commit()
    return {"ok": True}


@app.get("/stats")
def get_stats(session: Session = Depends(get_session)):
    fabrics = session.exec(select(Fabric)).all()
    return {
        "total_fabrics": len(fabrics),
        "total_stock_meters": sum(f.stock_meters for f in fabrics),
        "low_stock_count": sum(1 for f in fabrics if f.stock_meters < 20),
        "categories": len(set(f.category for f in fabrics)),
    }