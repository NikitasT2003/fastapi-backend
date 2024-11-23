from database import Base
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Boolean , ForeignKey , DateTime , Float , Text , Date
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    

    id = Column(Integer, primary_key=True, index=True)
    username: str = Column(String, unique=True, index=True)
    email: str = Column(String, unique=True, index=True)
    password: str = Column(String)
    is_active: bool = Column(Boolean, default=True)
    is_seller: bool = Column(Boolean, default=False)
    is_admin: bool = Column(Boolean, default=False)
    last_seen: datetime = Column(DateTime, default=datetime.utcnow)

    # Define the relationship to the Business model
    businesses = relationship("Business", back_populates="owner")

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    name: str = Column(String, index=True)
    description: str | None = Column(Text)
    location: str | None = Column(String)
    owner_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    owner = relationship("User", back_populates="businesses")
    founded: int | None = Column(Integer)
    industry: str | None = Column(String)
    email: str | None = Column(String, unique=True)
    