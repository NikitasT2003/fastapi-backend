"""Merge heads

Revision ID: b7f3534edd5f
Revises: 773ccb2a0c8b, 9ecad069eaac, d213d43e38da
Create Date: 2024-12-07 16:33:45.771089

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7f3534edd5f'
down_revision: Union[str, None] = ('773ccb2a0c8b', '9ecad069eaac', 'd213d43e38da')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
