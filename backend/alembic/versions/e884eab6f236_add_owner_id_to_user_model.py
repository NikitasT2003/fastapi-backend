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
    # Check if the column already exists before adding it
    if not op.get_bind().has_table('users') or 'owner_id' not in [col['name'] for col in op.get_bind().execute("SELECT column_name FROM information_schema.columns WHERE table_name='users'").fetchall()]:
        op.add_column('users', sa.Column('owner_id', sa.Integer(), nullable=True))

    # Check if the unique constraint already exists before creating it
    if not op.has_constraint('users', 'uq_users_owner_id'):
        op.create_unique_constraint('uq_users_owner_id', 'users', ['owner_id'])

    # Check if the foreign key constraint already exists before creating it
    if not op.has_constraint('businesses', 'fk_businesses_owner_id'):
        op.create_foreign_key('fk_businesses_owner_id', 'businesses', 'users', ['owner_id'], ['owner_id'])


def downgrade() -> None:
    # Drop the foreign key constraint
    op.drop_constraint(None, 'businesses', type_='foreignkey')

    # Drop the unique constraint
    op.drop_constraint(None, 'users', type_='unique')

    # Drop the owner_id column from the users table
    op.drop_column('users', 'owner_id')
