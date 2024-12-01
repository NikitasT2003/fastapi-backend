from fastapi import HTTPException, Depends, APIRouter
from typing import List
from sqlalchemy.orm import Session
import models
import schemas
from auth_handler import get_current_user
from database import get_db
from unique_id import generate_random_id

router = APIRouter()

# ROOT ROUTE 
@router.get("/")
async def root():
    return {"message": "API is Healthy!"}

# USER ROUTES
@router.get("/users/me/", response_model=schemas.UserResponse)
async def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user

@router.get("/user/", response_model=List[schemas.UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@router.get("/user/{user_id}", response_model=schemas.UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/user/{user_id}", response_model=schemas.UserResponse)
async def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.model_dump().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/user/{user_id}", response_model=dict)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "user_id": user_id}

# BUSINESS ROUTES
@router.get("/business/", response_model=List[schemas.BusinessResponse])
async def get_businesses(db: Session = Depends(get_db)):
    businesses = db.query(models.Business).all()
    return businesses

@router.post("/business/", response_model=schemas.BusinessResponse)
async def create_business(business: schemas.BusinessCreate, db: Session = Depends(get_db)):
    # Generate a unique owner_id for the business
    business.owner_id = generate_random_id()
    db_business = models.Business(**business.model_dump())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

@router.get("/business/{business_id}", response_model=schemas.BusinessResponse)
async def get_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(models.Business).filter(models.Business.id == business_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@router.put("/business/{business_id}", response_model=schemas.BusinessResponse)
async def update_business(business_id: int, business: schemas.BusinessCreate, db: Session = Depends(get_db)):
    db_business = db.query(models.Business).filter(models.Business.id == business_id).first()
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    for key, value in business.model_dump().items():
        setattr(db_business, key, value)
    db.commit()
    db.refresh(db_business)
    return db_business

@router.delete("/business/{business_id}", response_model=dict)
async def delete_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(models.Business).filter(models.Business.id == business_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    db.delete(business)
    db.commit()
    return {"message": "Business deleted successfully", "business_id": business_id}

