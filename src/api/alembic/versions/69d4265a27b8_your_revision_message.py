"""Your revision message

Revision ID: 69d4265a27b8
Revises: 051ed2070769
Create Date: 2024-12-07 17:10:52.527665

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69d4265a27b8'
down_revision: Union[str, None] = '051ed2070769'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
