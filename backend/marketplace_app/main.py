from fastapi import FastAPI , HTTPException , Depends
from pydantic import BaseModel
from database import engine , SessionLocal 
from typing import Annotated , List
from sqlalchemy.orm import Session
import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import schemas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.add_middleware(                             
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
   )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


# ROOT ROUTE 
@app.get("/")
async def root():
    return {"message": "Welcome to the Marketplace API"}



#USER ROUTES
@app.post("/user/", response_model=schemas.UserResponse)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/user/", response_model=List[schemas.UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@app.get("/user/{user_id}", response_model=schemas.UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/user/{user_id}", response_model=schemas.UserResponse)
async def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.model_dump().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/user/{user_id}", response_model=dict)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "user_id": user_id}





#BUSINESS ROUTES
@app.get("/business/", response_model=List[schemas.BusinessResponse])
async def get_businesses(db: Session = Depends(get_db)):
    businesses = db.query(models.Business).all()
    return businesses

@app.post("/business/", response_model=schemas.BusinessResponse)
async def create_business(business: schemas.BusinessCreate, db: Session = Depends(get_db)):
    db_business = models.Business(**business.model_dump())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

@app.get("/business/{business_id}", response_model=schemas.BusinessResponse)
async def get_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(models.Business).filter(models.Business.id == business_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@app.put("/business/{business_id}", response_model=schemas.BusinessResponse)
async def update_business(business_id: int, business: schemas.BusinessCreate, db: Session = Depends(get_db)):
    db_business = db.query(models.Business).filter(models.Business.id == business_id).first()
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    for key, value in business.dict().items():
        setattr(db_business, key, value)
    db.commit()
    db.refresh(db_business)
    return db_business

@app.delete("/business/{business_id}", response_model=dict)
async def delete_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(models.Business).filter(models.Business.id == business_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    db.delete(business)
    db.commit()
    return {"message": "Business deleted successfully", "business_id": business_id}

