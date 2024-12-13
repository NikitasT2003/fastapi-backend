"""Merge branches

Revision ID: c14731a71484
Revises: 96b1ed4e6dc7, bb19e891666b
Create Date: 2024-11-29 19:41:03.450769

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c14731a71484'
down_revision: Union[str, None] = ('96b1ed4e6dc7', 'bb19e891666b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
