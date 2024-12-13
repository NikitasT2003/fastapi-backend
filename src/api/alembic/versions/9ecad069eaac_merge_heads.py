"""Merge heads

Revision ID: 9ecad069eaac
Revises: 56768df8753b, e884eab6f236
Create Date: 2024-12-07 16:32:27.149957

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9ecad069eaac'
down_revision: Union[str, None] = ('56768df8753b', 'e884eab6f236')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
