"""Run once to populate the database with sample fabrics:  python seed.py"""
from sqlmodel import Session, select
from database import engine, init_db
from models import Fabric, User
from auth import hash_password

SAMPLE_FABRICS = [
    dict(name="Sea Island Poplin", sku="COT-SIP-101", category="Cotton",
         composition="100% cotton", color_name="Ivory", color_hex="#EDE8D6",
         pattern="Solid", weight_gsm=120, width_cm=150, price_per_meter=8.5,
         stock_meters=64, supplier="Nileworks Mills", season="All-season",
         usage="Shirting", care="Machine wash cold, tumble dry low."),
    dict(name="Vintage Rinse Denim", sku="DEN-VRD-204", category="Denim",
         composition="98% cotton, 2% elastane", color_name="Indigo", color_hex="#3B4B6B",
         pattern="Twill", weight_gsm=340, width_cm=145, price_per_meter=12.9,
         stock_meters=15, supplier="Kurabo Textiles", season="All-season",
         usage="Jeans, jackets", care="Wash inside-out, cold water."),
    dict(name="Belfast Linen", sku="LIN-BEL-317", category="Linen",
         composition="100% linen", color_name="Oatmeal", color_hex="#D8CBAE",
         pattern="Solid", weight_gsm=180, width_cm=140, price_per_meter=14.2,
         stock_meters=42, supplier="Emblem Linen Co.", season="Summer",
         usage="Dresses, trousers", care="Dry clean or gentle wash, cool iron."),
    dict(name="Mulberry Charmeuse", sku="SIL-MUL-450", category="Silk",
         composition="100% silk", color_name="Blush", color_hex="#E3B8B0",
         pattern="Solid", weight_gsm=60, width_cm=114, price_per_meter=26.0,
         stock_meters=9, supplier="Suzhou Silk House", season="All-season",
         usage="Blouses, lining", care="Dry clean only."),
    dict(name="Merino Flannel", sku="WOO-MER-582", category="Wool",
         composition="100% merino wool", color_name="Charcoal", color_hex="#3B3A38",
         pattern="Solid", weight_gsm=280, width_cm=150, price_per_meter=19.5,
         stock_meters=33, supplier="Abraham Moon", season="Winter",
         usage="Coats, suiting", care="Dry clean recommended."),
]

DEFAULT_USERS = [
    {"username": "admin", "password": "admin123", "role": "admin"},
    {"username": "staff", "password": "staff123", "role": "staff"},
]


def run():
    init_db()
    with Session(engine) as session:
        for data in SAMPLE_FABRICS:
            session.add(Fabric(**data))

        for u in DEFAULT_USERS:
            existing = session.exec(select(User).where(User.username == u["username"])).first()
            if not existing:
                session.add(User(
                    username=u["username"],
                    hashed_password=hash_password(u["password"]),
                    role=u["role"],
                ))

        session.commit()
    print(f"Seeded {len(SAMPLE_FABRICS)} fabrics and {len(DEFAULT_USERS)} users.")
    print("Login with: admin / admin123  (or)  staff / staff123")


if __name__ == "__main__":
    run()