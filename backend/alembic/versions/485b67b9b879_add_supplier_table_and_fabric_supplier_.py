"""add supplier table and fabric supplier_id v2

Revision ID: 485b67b9b879
Revises: d78d3994a979
Create Date: 2026-08-07 09:31:52.474304

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '485b67b9b879'
down_revision: Union[str, None] = 'd78d3994a979'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('fabric', sa.Column('supplier_id', sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column('fabric', 'supplier_id')