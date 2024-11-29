from database import Base
from sqlalchemy import Column, Integer, String, Boolean , ForeignKey , DateTime , Text
from datetime import datetime , timezone
from sqlalchemy.orm import relationship
from unique_id import generate_random_id



class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    is_seller = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    owner_id = Column(String, unique=True, nullable=True, default=generate_random_id)  # Ensure this is String

    businesses = relationship("Business", back_populates="owner")

class Business(Base):
    __tablename__ = "businesses"

    id = Column(String, primary_key=True, default=generate_random_id)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    owner_id = Column(String, ForeignKey('users.owner_id'))  # Ensure this is String
    owner = relationship("User", back_populates="businesses")
    founded = Column(Integer, nullable=True)
    industry = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=True)
    hashed_owner_id = Column(String, nullable=False)