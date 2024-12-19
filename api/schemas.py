from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: str
    profile_picture: Optional[str] = None
    description: Optional[str] = None

class UserCreate(UserBase):
    password: str
    is_seller: bool
    is_admin: bool

class UserResponse(UserBase):
    user_id: int
    is_seller: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Business Schemas
class BusinessBase(BaseModel):
    title: str
    description: str
    price: int
    industry: Optional[List[str]] = None
    logo: Optional[str] = None
    banner: Optional[str] = None

class BusinessCreate(BusinessBase):
    seller_id: int

class BusinessResponse(BusinessBase):
    listing_id: int
    seller_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Post Schemas
class PostBase(BaseModel):
    content: str
    image: Optional[str] = None

class PostCreate(PostBase):
    user_id: int

class PostResponse(PostBase):
    post_id: int
    user_id: int
    created_at: datetime
    likes: List['LikeResponse'] = []  # Include likes if needed

    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int
    user_id: int

class CommentResponse(CommentBase):
    comment_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Follow Schemas
class FollowBase(BaseModel):
    follower_id: int
    followed_id: int

class FollowCreate(FollowBase):
    pass

class FollowResponse(FollowBase):
    follow_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Like Schemas
class LikeBase(BaseModel):
    post_id: int
    user_id: int

class LikeCreate(LikeBase):
    pass

class LikeResponse(LikeBase):
    like_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Favorite Schemas
class FavoriteBase(BaseModel):
    post_id: int
    user_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteResponse(FavoriteBase):
    favorite_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    

class UserInDB(UserResponse):
    hashed_password: str