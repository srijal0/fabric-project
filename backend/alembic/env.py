import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from dotenv import load_dotenv

from alembic import context

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from sqlmodel import SQLModel
from models import Fabric  # noqa: F401  (import registers the table with SQLModel metadata)

config = context.config

db_url = os.getenv("DATABASE_URL", "sqlite:///./fabrics.db")
config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata