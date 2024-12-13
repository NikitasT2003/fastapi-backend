"""Create initial tables based on models

Revision ID: 07e62a688e62
Revises: b7f3534edd5f
Create Date: 2024-12-07 16:35:04.224817

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '07e62a688e62'
down_revision: Union[str, None] = 'b7f3534edd5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('user_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('username', sa.String(50), nullable=False, unique=True),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('password', sa.String(255), nullable=False),
        sa.Column('is_seller', sa.Boolean, default=False),
        sa.Column('is_admin', sa.Boolean, default=False),
        sa.Column('profile_picture', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
    )

    # Create businesses table
    op.create_table(
        'businesses',
        sa.Column('listing_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(100), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('price', sa.Integer, nullable=False),
        sa.Column('industry', sa.ARRAY(sa.String), nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('seller_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
    )

    # Create posts table
    op.create_table(
        'posts',
        sa.Column('post_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('image', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
    )

    # Create comments table
    op.create_table(
        'comments',
        sa.Column('comment_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('post_id', sa.Integer, sa.ForeignKey('posts.post_id'), nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
    )

    # Create follows table
    op.create_table(
        'follows',
        sa.Column('follow_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('follower_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
        sa.Column('followed_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
    )

    # Create likes table
    op.create_table(
        'likes',
        sa.Column('like_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('post_id', sa.Integer, sa.ForeignKey('posts.post_id'), nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
    )

    # Create favorites table
    op.create_table(
        'favorites',
        sa.Column('favorite_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('post_id', sa.Integer, sa.ForeignKey('posts.post_id'), nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
    )


def downgrade() -> None:
    # Drop tables in reverse order of creation
    op.drop_table('favorites')
    op.drop_table('likes')
    op.drop_table('follows')
    op.drop_table('comments')
    op.drop_table('posts')
    op.drop_table('businesses')
    op.drop_table('users')
