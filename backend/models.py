from typing import Optional
from sqlmodel import SQLModel, Field
import time


class FabricBase(SQLModel):
    name: str
    sku: str
    category: str
    composition: str = ""
    color_name: str = ""
    color_hex: str = "#cccccc"
    pattern: str = ""
    weight_gsm: float = 0
    width_cm: float = 0
    price_per_meter: float = 0
    stock_meters: float = 0
    supplier: str = ""
    season: str = ""
    usage: str = ""
    care: str = ""
    notes: str = ""


class Fabric(FabricBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_added: float = Field(default_factory=lambda: time.time())


class FabricCreate(FabricBase):
    pass


class FabricUpdate(SQLModel):
    name: Optional[str] = None
    category: Optional[str] = None
    composition: Optional[str] = None
    color_name: Optional[str] = None
    color_hex: Optional[str] = None
    pattern: Optional[str] = None
    weight_gsm: Optional[float] = None
    width_cm: Optional[float] = None
    price_per_meter: Optional[float] = None
    stock_meters: Optional[float] = None
    supplier: Optional[str] = None
    season: Optional[str] = None
    usage: Optional[str] = None
    care: Optional[str] = None
    notes: Optional[str] = None


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    role: str = "staff"   # "staff" or "admin"