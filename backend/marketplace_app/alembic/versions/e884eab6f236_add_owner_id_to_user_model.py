"""Add owner_id to User model

Revision ID: e884eab6f236
Revises: bb19e891666b
Create Date: 2024-11-29 19:30:55.786957

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e884eab6f236'
down_revision: Union[str, None] = 'bb19e891666b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the owner_id column to the users table
    op.add_column('users', sa.Column('owner_id', sa.Integer(), nullable=True))

    # Create a unique constraint on the owner_id column
    op.create_unique_constraint(None, 'users', ['owner_id'])

    # Add the foreign key constraint to the businesses table
    op.create_foreign_key(None, 'businesses', 'users', ['owner_id'], ['owner_id'])


def downgrade() -> None:
    # Drop the foreign key constraint
    op.drop_constraint(None, 'businesses', type_='foreignkey')

    # Drop the unique constraint
    op.drop_constraint(None, 'users', type_='unique')

    # Drop the owner_id column from the users table
    op.drop_column('users', 'owner_id')
