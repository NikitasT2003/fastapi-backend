from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    is_active: Optional[bool] = True
    is_seller: Optional[bool] = False
    is_admin: Optional[bool] = False


class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    last_seen: datetime

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

class BusinessResponse(BusinessBase):
    id: int

    class Config:
        from_attributes = True
