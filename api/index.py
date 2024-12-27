# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Boolean , ForeignKey , DateTime , Text, ARRAY
from datetime import datetime , timezone
from sqlalchemy.orm import relationship
from pydantic_settings import BaseSettings
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import Session
import secrets
from pydantic import BaseModel, EmailStr
from typing import Union, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func  
from typing import List
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func  
from typing import List
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

SECRET_KEY = "d2192d5e10374bc755f11f67282dcdd251e178d165ccb9aaec9e4b3a3e733710"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"

settings = Settings()

SQLALCHEMY_DATABASE_URL = settings.database_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# GENERATE RANDOM ID FOR BUSINESS OWNER IN DB
def generate_random_id(min_value=1, max_value=999999):
    """Generate a secure random integer ID."""
    return secrets.randbelow(max_value - min_value + 1) + min_value

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, default=generate_random_id)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    is_seller = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    profile_picture = Column(String(255), nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    description = Column(String(255), nullable=True)
    
    # Relationships
    listings = relationship('Business', back_populates='seller', cascade="all, delete-orphan")
    posts = relationship('Post', back_populates='user', foreign_keys='Post.user_id', cascade="all, delete")
    comments = relationship('Comment', back_populates='user', cascade="all, delete")
    likes = relationship('Like', back_populates='user', cascade="all, delete")
    favorites = relationship('Favorite', back_populates='user', cascade="all, delete")
    following = relationship('Follow', foreign_keys='Follow.follower_id', back_populates='follower', cascade="all, delete")
    followers = relationship('Follow', foreign_keys='Follow.followed_id', back_populates='followed', cascade="all, delete")
    shares = relationship('Share', back_populates='user', cascade="all, delete")

# Business Listing Model
class Business(Base):
    __tablename__ = 'businesses'
    
    listing_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    industry = Column(ARRAY(String), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    seller_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    logo = Column(String(255), nullable=True)  # URL for the business logo
    banner = Column(String(255), nullable=True)  # URL for the business banner

    # Relationships
    seller = relationship('User', back_populates='listings')
    shares = relationship('Share', back_populates='business', cascade="all, delete")

# Post Model
class Post(Base):
    __tablename__ = 'posts'
    
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    author = Column(String(100), ForeignKey ('users.username', ondelete='CASCADE'), nullable=False)
    avatar = Column(String(255), ForeignKey('users.profile_picture', ondelete='CASCADE'), nullable=True)
    # Relationships
    
    user = relationship('User', back_populates='posts', foreign_keys=[user_id])
    comments = relationship('Comment', back_populates='post', cascade="all, delete")
    likes = relationship('Like', back_populates='post', cascade="all, delete")
    favorites = relationship('Favorite', back_populates='post', cascade="all, delete")
    shares = relationship('Share', back_populates='post', cascade="all, delete")

# Comment Model
class Comment(Base):
    __tablename__ = 'comments'
    
    comment_id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    
    # Relationships
    post = relationship('Post', back_populates='comments')
    user = relationship('User', back_populates='comments')

# Follow Model
class Follow(Base):
    __tablename__ = 'follows'
    
    follow_id = Column(Integer, primary_key=True, autoincrement=True)
    follower_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    followed_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    follower = relationship('User', foreign_keys=[follower_id], back_populates='following')
    followed = relationship('User', foreign_keys=[followed_id], back_populates='followers')

# Like Model
class Like(Base):
    __tablename__ = 'likes'

    like_id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    post = relationship('Post', back_populates='likes')
    user = relationship('User', back_populates='likes')

# Favorite Model
class Favorite(Base):
    __tablename__ = 'favorites'
    
    favorite_id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    user = relationship("User", back_populates="favorites")
    post = relationship("Post", back_populates="favorites")

class Share(Base):
    __tablename__ = 'shares'
    
    share_id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Integer, ForeignKey('businesses.listing_id', ondelete='CASCADE'), nullable=False)
    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    # Relationships
    post = relationship('Post', back_populates='shares')
    business = relationship('Business', back_populates='shares')
    user = relationship('User', back_populates='shares')
    

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








app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json" , debug=True)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user(db, token_data.username)
    if user is None:
        raise credentials_exception
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/healthcheck", response_model=dict)
async def healthcheck():
    return {"status": "success", "message": "API is healthy"}

@app.post("/signup", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Ensure that the name is provided
    if not user.name:
        raise HTTPException(status_code=400, detail="Name is required")

    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        is_seller=user.is_seller,
        
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user




@app.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")



# ROOT ROUTE 
@app.get("/")
async def root():
    return {"message": "API is Healthy!"}

# USER ROUTES
@app.get("/users/me/", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@app.get("/user/", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/user/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/user/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.model_dump().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/user/{user_id}", response_model=dict)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not get_current_user.is_admin:
        raise HTTPException(
            status_code= 403 ,
            detail="Admin access required to delete users."
        )
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "user_id": user_id}

# BUSINESS ROUTES
@app.get("/business/", response_model=dict)
async def fetch_businesses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get paginated business listings."""
    businesses = db.query(Business).offset(skip).limit(limit).all()
    total_businesses = db.query(Business).count()  # Get total count of businesses

    return {
        "items": businesses,
        "totalBusinesses": total_businesses,  # Return total number of businesses
    }

@app.post("/business/", response_model=BusinessResponse)
async def create_business(business: BusinessCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Create a new business listing."""
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Only sellers can create a business listing.")
    
    db_business = Business(**business.model_dump())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

@app.get("/business/{business_id}", response_model=BusinessResponse)
async def get_business(business_id: int, db: Session = Depends(get_db)):
    """Get a specific business listing by ID."""
    business = db.query(Business).filter(Business.listing_id == business_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@app.put("/business/{business_id}", response_model=BusinessResponse)
async def update_business(business_id: int, business: BusinessCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Update a business listing."""
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Only sellers can update a business listing.")
    
    db_business = db.query(Business).filter(Business.listing_id == business_id).first()
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Update business details
    db_business.title = business.title
    db_business.description = business.description
    db_business.price = business.price
    db_business.industry = business.industry
    
    db.commit()
    db.refresh(db_business)
    return db_business

@app.delete("/business/{business_id}", response_model=dict)
async def delete_business(business_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Delete a business listing."""
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Only sellers can delete a business listing.")
    
    db_business = db.query(Business).filter(Business.listing_id == business_id).first()
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    db.delete(db_business)
    db.commit()
    return {"message": "Business deleted successfully", "business_id": business_id}

@app.post("/business/{listing_id}/likes/", response_model=dict)
async def like_business(listing_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Like a business."""
    business = db.query(Business).filter(Business.listing_id == listing_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    existing_like = db.query(Like).filter(Like.business_id == listing_id, Like.user_id == current_user.user_id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Business already liked")

    new_like = Like(business_id=listing_id, user_id=current_user.user_id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)

    return {"message": "Business liked successfully", "listing_id": listing_id}


@app.delete("/business/{listing_id}/unlike", response_model=dict)
async def unlike_business(listing_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Unlike a business."""
    business = db.query(Business).filter(Business.listing_id == listing_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    existing_like = db.query(Like).filter(Like.business_id == listing_id, Like.user_id == current_user.user_id).first()
    if existing_like is None:
        raise HTTPException(status_code=400, detail="Business not liked yet")
    
    db.delete(existing_like)
    db.commit()
    db.refresh(existing_like)
    
    return {"message": "Business unliked successfully", "listing_id": listing_id}

# Like Count Endpoint
@app.get("/posts/{post_id}/likes/count", response_model=int)
async def get_like_count(post_id: int, db: Session = Depends(get_db)):
    """Get the total like count for a specific post."""
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return len(post.likes)  # Return the count of likes

@app.post("/posts/{post_id}/like", response_model=LikeResponse)
async def like_post(post_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Like a post."""
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.user_id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Post already liked")
    
    new_like = Like(post_id=post_id, user_id=current_user.user_id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)
    return new_like

@app.delete("/posts/{post_id}/like", response_model=LikeResponse)
async def unlike_post(post_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Unlike a post."""
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.user_id).first()
    if existing_like is None:
        raise HTTPException(status_code=400, detail="Post not liked yet")
    
    db.delete(existing_like)
    db.commit()
    return existing_like

# Create Post Endpoint
@app.post("/posts/", response_model=PostResponse)
async def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Create a new post."""
    new_post = Post(content=post.content, image=post.image, user_id=current_user.user_id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# Comment Routes
@app.post("/posts/{post_id}/comments/", response_model=CommentResponse)
async def create_comment(post_id: int, comment: CommentCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Create a new comment on a post."""
    new_comment = Comment(content=comment.content, post_id=post_id, user_id=current_user.user_id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@app.get("/posts/{post_id}/comments/", response_model=List[CommentResponse])
async def get_comments(post_id: int, db: Session = Depends(get_db)):
    """Get all comments for a specific post."""
    comments = db.query(Comment).filter(Comment.post_id == post_id).all()
    return comments

@app.delete("/comments/{comment_id}", response_model=dict)
async def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    """Delete a comment."""
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully", "comment_id": comment_id}

# Follow Routes
@app.post("/users/{user_id}/follow", response_model=FollowResponse)
async def follow_user(user_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Follow a user."""
    if current_user.user_id == user_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself.")
    
    user_to_follow = db.query(User).filter(User.user_id == user_id).first()
    if user_to_follow is None:
        raise HTTPException(status_code=404, detail="User not found.")
    
    existing_follow = db.query(Follow).filter(Follow.follower_id == current_user.user_id, Follow.followed_id == user_id).first()
    if existing_follow:
        raise HTTPException(status_code=400, detail="You are already following this user.")
    
    new_follow = Follow(follower_id=current_user.user_id, followed_id=user_id)
    db.add(new_follow)
    db.commit()
    db.refresh(new_follow)
    return new_follow

@app.delete("/users/{user_id}/unfollow", response_model=dict)
async def unfollow_user(user_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Unfollow a user."""
    if current_user.user_id == user_id:
        raise HTTPException(status_code=400, detail="You cannot unfollow yourself.")
    
    follow = db.query(Follow).filter(Follow.follower_id == current_user.user_id, Follow.followed_id == user_id).first()
    if follow is None:
        raise HTTPException(status_code=404, detail="Follow relationship not found")
    
    db.delete(follow)
    db.commit()

# Favorite Routes
@app.post("/posts/{post_id}/favorites/", response_model=FavoriteResponse)
async def create_favorite(post_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Favorite a post."""
    new_favorite = Favorite(post_id=post_id, user_id=current_user.user_id)
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@app.get("/users/me/favorites/", response_model=List[FavoriteResponse])
async def get_favorites(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Get all favorites for the current user."""
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.user_id).all()
    return favorites

@app.delete("/favorites/{favorite_id}", response_model=dict)
async def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    """Delete a favorite."""
    favorite = db.query(Favorite).filter(Favorite.favorite_id == favorite_id).first()
    if favorite is None:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite deleted successfully", "favorite_id": favorite_id}

@app.get("/posts/", response_model=PostResponse)
async def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get paginated posts."""
    posts = db.query(Post).offset(skip).limit(limit).all()
    total_posts = db.query(Post).count()  # Get total count of posts
    next_page = skip + limit if skip + limit < total_posts else None  # Calculate next page

    return {
        "items": posts,
        "totalPosts": total_posts,  # Return total number of posts
        "nextPage": next_page,  # Return next page number or None
    }

@app.get("/users/suggestions/", response_model=List[UserResponse])
async def get_user_suggestions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get user follow suggestions based on collaborative filtering.
    """
    suggestions = get_follow_suggestions(current_user.user_id, db)
    return suggestions

# Update Post Endpoint
@app.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(post_id: int, post: PostCreate, db: Session = Depends(get_db)):
    """Update a post."""
    db_post = db.query(Post).filter(Post.post_id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Update post details
    db_post.content = post.content
    db_post.image = post.image
    db.commit()
    db.refresh(db_post)
    return db_post

# Update Comment Endpoint
@app.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(comment_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    """Update a comment."""
    db_comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Update comment details
    db_comment.content = comment.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.post("/posts/{post_id}/share", response_model=dict)
async def share_post(post_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    """Share a post."""
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    # Create a new share entry
    new_share = Share(post_id=post_id, user_id=current_user.user_id)
    db.add(new_share)
    db.commit()
    db.refresh(new_share)

    return {"message": "Post shared successfully", "post_id": post_id}


@app.get("/posts/{post_id}/shares/", response_model=List[ShareResponse])
async def get_shares(post_id: int, db: Session = Depends(get_db)):
    """Get all shares for a specific post."""
    shares = db.query(Share).filter(Share.post_id == post_id).all()
    return shares



@app.post("/posts/{post_id}/shares/", response_model=list[ShareResponse])
async def create_share(post_id: int, share: ShareCreate, db: Session = Depends(get_db)):
    """Create a new share."""
    new_share = Share(post_id=post_id, **share.model_dump())
    db.add(new_share)
    db.commit()
    db.refresh(new_share)
    return new_share

@app.get("/business/{listing_id}/shares/", response_model=list[ShareResponse])
async def get_business_shares(listing_id: int, db: Session = Depends(get_db)):
    """Get all shares for a specific business."""
    shares = db.query(Share).filter(Share.business_id == listing_id).all()
    return shares

@app.post("/business/{listing_id}/shares/", response_model=list[ShareResponse])
async def create_business_share(listing_id: int, share: ShareCreate, db: Session = Depends(get_db)):
    """Create a new share for a specific business."""
    new_share = Share(business_id=listing_id, **share.model_dump())
    db.add(new_share)
    db.commit()
    db.refresh(new_share)
    return new_share



def get_user_likes(db: Session):
    # Fetch all likes from the database
    likes = db.query(Like).all()
    return likes

def get_user_follows(db: Session):
    # Fetch all follows from the database
    follows = db.query(Follow).all()
    return follows

def create_user_item_matrix(likes):
    # Create a DataFrame from the likes data
    data = [(like.user_id, like.post_id) for like in likes]
    df = pd.DataFrame(data, columns=['user_id', 'post_id'])
    
    # Create a user-item interaction matrix
    user_item_matrix = df.pivot_table(index='user_id', columns='post_id', aggfunc='size', fill_value=0)
    return user_item_matrix

def get_follow_counts(db: Session):
    # Get follow counts for each user
    follow_counts = db.query(Follow.followed_id, func.count(Follow.follower_id)).group_by(Follow.followed_id).all()
    return {followed_id: count for followed_id, count in follow_counts}

def get_like_counts(db: Session):
    # Get like counts for each user
    like_counts = db.query(Like.user_id, func.count(Like.post_id)).group_by(Like.user_id).all()
    return {user_id: count for user_id, count in like_counts}

def get_follow_suggestions(current_user_id: int, db: Session) -> List[User]:
    likes = get_user_likes(db)
    user_item_matrix = create_user_item_matrix(likes)

    # Compute cosine similarity between users
    user_similarity = cosine_similarity(user_item_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

    # Get similar users
    similar_users = user_similarity_df[current_user_id].nlargest(6).index.tolist()  # Get top 5 similar users (excluding self)
    similar_users.remove(current_user_id)  # Remove the current user from suggestions

    # Fetch user details
    suggested_users = db.query(User).filter(User.user_id.in_(similar_users)).all()

    # Get follow and like counts
    follow_counts = get_follow_counts(db)
    like_counts = get_like_counts(db)

    # Combine suggestions based on follow and like counts
    combined_scores = {}
    for user in suggested_users:
        score = 0
        score += follow_counts.get(user.user_id, 0) * 0.5  # Weight for follow count
        score += like_counts.get(user.user_id, 0) * 0.5  # Weight for like count
        combined_scores[user.user_id] = score

    # Sort users by combined score
    sorted_users = sorted(suggested_users, key=lambda u: combined_scores.get(u.user_id, 0), reverse=True)

    return sorted_users[:5]  # Return top 5 users





app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



