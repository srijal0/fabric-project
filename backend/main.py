import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import init_db, get_session
from models import Fabric, FabricCreate, FabricUpdate

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
def create_fabric(fabric: FabricCreate, session: Session = Depends(get_session)):
    db_fabric = Fabric.from_orm(fabric)
    session.add(db_fabric)
    session.commit()
    session.refresh(db_fabric)
    return db_fabric


@app.patch("/fabrics/{fabric_id}", response_model=Fabric)
def update_fabric(fabric_id: int, updates: FabricUpdate, session: Session = Depends(get_session)):
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
def delete_fabric(fabric_id: int, session: Session = Depends(get_session)):
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