from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    email: EmailStr
    password: str
    is_seller: bool

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    email: EmailStr
    is_active: bool
    is_admin: bool
    last_seen: Optional[datetime] = None
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
    