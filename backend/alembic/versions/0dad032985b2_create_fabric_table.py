"""create fabric table

Revision ID: 0dad032985b2
Revises: 9e99f4c97dce
Create Date: 2026-07-02 16:25:55.319115

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '0dad032985b2'
down_revision: Union[str, None] = '9e99f4c97dce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
