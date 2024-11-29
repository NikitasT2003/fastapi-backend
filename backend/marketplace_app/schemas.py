from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    is_seller: bool

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    last_seen: datetime
    owner_id: Optional[str] = None

    class Config:
        from_attributes = True

# Business Schemas
class BusinessBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    founded: Optional[int] = None
    industry: Optional[str] = None
    email: Optional[str] = None

class BusinessCreate(BusinessBase):
    owner_id: int
    hashed_owner_id: Optional[str] = None

class BusinessResponse(BusinessBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserInDB(UserResponse):
    hashed_password: str
    