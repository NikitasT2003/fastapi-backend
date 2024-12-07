from database import Base
from sqlalchemy import Column, Integer, String, Boolean , ForeignKey , DateTime , Text, ARRAY
from datetime import datetime , timezone
from sqlalchemy.orm import relationship
from unique_id import generate_random_id



class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, default=generate_random_id)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    is_seller = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    profile_picture = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    listings = relationship('Business', back_populates='seller', cascade="all, delete-orphan")
    posts = relationship('Post', back_populates='user', cascade="all, delete")
    comments = relationship('Comment', back_populates='user', cascade="all, delete")
    likes = relationship('Like', back_populates='user', cascade="all, delete")
    favorites = relationship('Favorite', back_populates='user', cascade="all, delete")
    following = relationship('Follow', foreign_keys='Follow.follower_id', back_populates='follower', cascade="all, delete")
    followers = relationship('Follow', foreign_keys='Follow.followed_id', back_populates='followed', cascade="all, delete")

# Business Listing Model
class Business(Base):
    __tablename__ = 'businesses'
    
    listing_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    industry = Column(ARRAY(String), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    seller_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    # Relationships
    seller = relationship('User', back_populates='listings')

# Post Model
class Post(Base):
    __tablename__ = 'posts'
    
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='posts')
    comments = relationship('Comment', back_populates='post', cascade="all, delete")
    likes = relationship('Like', back_populates='post', cascade="all, delete")
    favorites = relationship('Favorite', back_populates='post', cascade="all, delete")

# Comment Model
class Comment(Base):
    __tablename__ = 'comments'
    
    comment_id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    
    # Relationships
    post = relationship('Post', back_populates='comments')
    user = relationship('User', back_populates='comments')

# Follow Model
class Follow(Base):
    __tablename__ = 'follows'
    
    follow_id = Column(Integer, primary_key=True, autoincrement=True)
    follower_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    followed_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    follower = relationship('User', foreign_keys=[follower_id], back_populates='following')
    followed = relationship('User', foreign_keys=[followed_id], back_populates='followers')

# Like Model
class Like(Base):
    __tablename__ = 'likes'

    like_id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    post = relationship('Post', back_populates='likes')
    user = relationship('User', back_populates='likes')

# Favorite Model
class Favorite(Base):
    __tablename__ = 'favorites'
    
    favorite_id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    post = relationship('Post', back_populates='favorites')
    user = relationship('User', back_populates='favorites')