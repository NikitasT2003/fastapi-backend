"""Recreate missing migration

Revision ID: 773ccb2a0c8b
Revises: 
Create Date: 2024-11-29 19:54:56.495112

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '773ccb2a0c8b'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands to alter existing tables ###

    # Add the owner_id column to the users table if it doesn't exist
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('owner_id', sa.Integer(), unique=True, nullable=True))
        # Ensure the owner_id column is unique
        batch_op.create_unique_constraint('uq_users_owner_id', ['owner_id'])

    # Alter the businesses table to ensure it matches the model
    with op.batch_alter_table('businesses') as batch_op:
        # Ensure the id column is of type String
        batch_op.alter_column('id', type_=sa.String(), existing_type=sa.Integer())
        # Ensure the owner_id column references the correct column in users
        batch_op.drop_constraint('businesses_owner_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['owner_id'], ['owner_id'])
        # Ensure the email column is unique
        batch_op.create_unique_constraint('uq_businesses_email', ['email'])

    # ### end of commands ###


def downgrade() -> None:
    # ### commands to revert the alterations ###

    # Revert changes to the users table
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('uq_users_owner_id', type_='unique')
        batch_op.drop_column('owner_id')

    # Revert changes to the businesses table
    with op.batch_alter_table('businesses') as batch_op:
        batch_op.drop_constraint('uq_businesses_email', type_='unique')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('businesses_owner_id_fkey', 'users', ['owner_id'], ['id'], ondelete='CASCADE')
        batch_op.alter_column('id', type_=sa.Integer(), existing_type=sa.String())

    # ### end of commands ###