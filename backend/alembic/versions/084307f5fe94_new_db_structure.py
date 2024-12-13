"""new db structure

Revision ID: 084307f5fe94
Revises: 
Create Date: 2024-12-07 16:59:53.501026

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import inspect  # Import the inspect function

# revision identifiers, used by Alembic.
revision: str = '084307f5fe94'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get the current connection
    conn = op.get_bind()
    inspector = inspect(conn)  # Create an inspector for the connection

    # Check if the users table exists before creating it
    if 'users' not in inspector.get_table_names():
        op.create_table('users',
            sa.Column('user_id', sa.Integer(), autoincrement=True, nullable=False, primary_key=True),
            sa.Column('username', sa.String(length=50), nullable=False),
            sa.Column('email', sa.String(length=100), nullable=False),
            sa.Column('password', sa.String(length=100), nullable=False),
            sa.Column('profile_picture', sa.String(length=255), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True)
        )

    # Check if the follows table exists before creating it
    if 'follows' not in inspector.get_table_names():
        op.create_table('follows',
            sa.Column('follow_id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('follower_id', sa.Integer(), nullable=False),
            sa.Column('followed_id', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['followed_id'], ['users.user_id']),
            sa.ForeignKeyConstraint(['follower_id'], ['users.user_id']),
            sa.PrimaryKeyConstraint('follow_id')
        )

    # Create other tables (posts, comments, favorites, likes) as needed
    op.create_table('posts',
        sa.Column('post_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('image', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id']),
        sa.PrimaryKeyConstraint('post_id')
    )

    op.create_table('comments',
        sa.Column('comment_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['posts.post_id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id']),
        sa.PrimaryKeyConstraint('comment_id')
    )

    op.create_table('favorites',
        sa.Column('favorite_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['post_id'], ['posts.post_id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id']),
        sa.PrimaryKeyConstraint('favorite_id')
    )

    op.create_table('likes',
        sa.Column('like_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['post_id'], ['posts.post_id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id']),
        sa.PrimaryKeyConstraint('like_id')
    )

    # Alter the businesses table
    op.add_column('businesses', sa.Column('listing_id', sa.Integer(), autoincrement=True, nullable=False))
    op.add_column('businesses', sa.Column('title', sa.String(length=100), nullable=False))
    op.add_column('businesses', sa.Column('price', sa.Integer(), nullable=False))
    op.add_column('businesses', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('businesses', sa.Column('seller_id', sa.Integer(), nullable=False))
    op.alter_column('businesses', 'description',
               existing_type=sa.TEXT(),
               nullable=False)
    op.drop_constraint('businesses_email_key', 'businesses', type_='unique')
    op.drop_index('ix_businesses_name', table_name='businesses')
    op.drop_constraint('businesses_owner_id_fkey', 'businesses', type_='foreignkey')
    op.create_foreign_key(None, 'businesses', 'users', ['seller_id'], ['user_id'])
    op.drop_column('businesses', 'owner_id')
    op.drop_column('businesses', 'id')
    op.drop_column('businesses', 'email')
    op.drop_column('businesses', 'location')
    op.drop_column('businesses', 'name')
    op.drop_column('businesses', 'hashed_owner_id')
    op.drop_column('businesses', 'founded')
    op.add_column('users', sa.Column('user_id', sa.Integer(), autoincrement=True, nullable=False))
    op.add_column('users', sa.Column('profile_picture', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.alter_column('users', 'username',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('users', 'password',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_username', table_name='users')
    op.drop_constraint('users_owner_id_key', 'users', type_='unique')
    op.create_unique_constraint(None, 'users', ['email'])
    op.create_unique_constraint(None, 'users', ['username'])
    op.drop_column('users', 'last_seen')
    op.drop_column('users', 'id')
    op.drop_column('users', 'owner_id')
    op.drop_column('users', 'is_active')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('owner_id', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False))
    op.add_column('users', sa.Column('last_seen', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_constraint(None, 'users', type_='unique')
    op.create_unique_constraint('users_owner_id_key', 'users', ['owner_id'])
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.alter_column('users', 'password',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('users', 'username',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('users', 'created_at')
    op.drop_column('users', 'profile_picture')
    op.drop_column('users', 'user_id')
    op.add_column('businesses', sa.Column('founded', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('businesses', sa.Column('hashed_owner_id', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('businesses', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('businesses', sa.Column('location', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('businesses', sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('businesses', sa.Column('id', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('businesses', sa.Column('owner_id', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'businesses', type_='foreignkey')
    op.create_foreign_key('businesses_owner_id_fkey', 'businesses', 'users', ['owner_id'], ['owner_id'])
    op.create_index('ix_businesses_name', 'businesses', ['name'], unique=False)
    op.create_unique_constraint('businesses_email_key', 'businesses', ['email'])
    op.alter_column('businesses', 'description',
               existing_type=sa.TEXT(),
               nullable=True)
    op.drop_column('businesses', 'seller_id')
    op.drop_column('businesses', 'created_at')
    op.drop_column('businesses', 'price')
    op.drop_column('businesses', 'title')
    op.drop_column('businesses', 'listing_id')
    op.drop_table('likes')
    op.drop_table('favorites')
    op.drop_table('comments')
    op.drop_table('posts')
    op.drop_table('follows')
    # ### end Alembic commands ###
