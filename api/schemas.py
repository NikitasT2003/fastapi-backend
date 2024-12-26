from pydantic import BaseModel, EmailStr
from typing import Union, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: str
    profile_picture: Union[str, None] = None
    description: Union[str, None] = None

class UserCreate(UserBase):
    password: str
    is_seller: bool
    

class UserResponse(UserBase):
    name: str
    profile_picture: Union[str, None] = None
    is_seller: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Business Schemas
class BusinessBase(BaseModel):
    title: str
    description: str
    price: int
    industry: Union[List[str], None] = None
    logo: Union[str, None] = None
    banner: Union[str, None] = None

class BusinessCreate(BusinessBase):
    seller_id: int

class BusinessResponse(BusinessBase): 
    seller_id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

# Post Schemas
class PostBase(BaseModel):
    content: str
    image: Union[str, None] = None
    author: str
class PostCreate(PostBase):
    user_id: int

class PostResponse(PostBase):   
    created_at: datetime
    likes: Union[List['LikeResponse'], None] = None  # Ensure 'LikeResponse' is defined

    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int
    user_id: int

class CommentResponse(CommentBase):
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
    created_at: datetime

    class Config:
        from_attributes = True


class ShareBase(BaseModel):
    post_id: Union[int, None] = None
    business_id: Union[int, None] = None
    user_id: int  

class ShareCreate(ShareBase):
    pass

class ShareResponse(ShareBase):
    created_at: datetime

    class Config:
        from_attributes = True



# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class UserInDB(UserResponse):
    hashed_password: str