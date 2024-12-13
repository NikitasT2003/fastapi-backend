"""Add hashed_owner_id to businesses

Revision ID: bb19e891666b
Revises: 5e61aea1ddaf
Create Date: 2024-11-29 18:43:56.998130

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bb19e891666b'
down_revision: Union[str, None] = '5e61aea1ddaf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Set a default value for existing rows
    op.execute("UPDATE businesses SET hashed_owner_id = 'default_value' WHERE hashed_owner_id IS NULL")

    # Now alter the column to be NOT NULL
    op.alter_column('businesses', 'hashed_owner_id',
                   existing_type=sa.String(),
                   nullable=False)


def downgrade() -> None:
    op.alter_column('businesses', 'hashed_owner_id',
                   existing_type=sa.String(),
                   nullable=True)
