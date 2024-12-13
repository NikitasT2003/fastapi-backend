from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session

from auth_handler import authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_user, get_password_hash
from database import get_db
from schemas import Token, UserCreate, UserResponse
from models import User

router = APIRouter()


@router.post("/signup", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    
        db_user = db.query(User).filter(User.username == user.username).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered.")
        
        hashed_password = get_password_hash(user.password)
        new_user = User(
            username=user.username,
            email=user.email,
            password=hashed_password,
            is_seller=user.is_seller,
            is_admin = user.is_admin
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user



@router.post("/login", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
) -> Token:
    print("Starting login process...")
    
    user = authenticate_user(db, form_data.username, form_data.password)
    print(f"Authentication result: {user}")
    
    if not user:
        print("Authentication failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    
    return {"access_token": access_token, "token_type": "bearer"}

