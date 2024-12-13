"""Recreate missing migration

Revision ID: 96b1ed4e6dc7
Revises: 
Create Date: 2024-11-29 19:38:50.691474

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '96b1ed4e6dc7'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
