"""add supplier table and fabric supplier_id

Revision ID: d78d3994a979
Revises: 64d9abbf34b2
Create Date: 2026-08-07 09:16:48.559286

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'd78d3994a979'
down_revision: Union[str, None] = '64d9abbf34b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
