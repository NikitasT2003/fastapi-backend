from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from auth_handler import (
    get_current_user,
    authenticate_user,
    create_access_token,
    get_user,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import get_db
from unique_id import generate_random_id
from models import User, Like, Follow
from schemas import  UserCreate , UserResponse , Token, PostCreate, CommentCreate, CommentResponse, PostResponse, ShareCreate, ShareResponse
import schemas
import models
from follow_suggestions import get_follow_suggestions
import follow_suggestions

router = APIRouter()

@router.post("/healthcheck", response_model=dict)
async def healthcheck():
    return {"status": "sucess", "message": "API is healthy"}

@router.post("/signup", response_model=UserResponse)
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
        password=hashed_password,
        name=user.name,
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
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
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
@router.get("/business/", response_model=dict)
async def fetch_businesses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get paginated business listings."""
    businesses = db.query(models.Business).offset(skip).limit(limit).all()
    total_businesses = db.query(models.Business).count()  # Get total count of businesses

    return {
        "items": businesses,
        "totalBusinesses": total_businesses,  # Return total number of businesses
    }

@router.post("/business/", response_model=schemas.BusinessResponse)
async def create_business(business: schemas.BusinessCreate, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Create a new business listing."""
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Only sellers can create a business listing.")
    
    db_business = models.Business(**business.model_dump())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

@router.get("/business/{business_id}", response_model=schemas.BusinessResponse)
async def get_business(business_id: int, db: Session = Depends(get_db)):
    """Get a specific business listing by ID."""
    business = db.query(models.Business).filter(models.Business.listing_id == business_id).first()
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@router.put("/business/{business_id}", response_model=schemas.BusinessResponse)
async def update_business(business_id: int, business: schemas.BusinessCreate, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Update a business listing."""
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Only sellers can update a business listing.")
    
    db_business = db.query(models.Business).filter(models.Business.listing_id == business_id).first()
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

@router.delete("/business/{business_id}", response_model=dict)
async def delete_business(business_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Delete a business listing."""
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Only sellers can delete a business listing.")
    
    db_business = db.query(models.Business).filter(models.Business.listing_id == business_id).first()
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    db.delete(db_business)
    db.commit()
    return {"message": "Business deleted successfully", "business_id": business_id}

# Like Count Endpoint
@router.get("/posts/{post_id}/likes/count", response_model=int)
async def get_like_count(post_id: int, db: Session = Depends(get_db)):
    """Get the total like count for a specific post."""
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return len(post.likes)  # Return the count of likes

@router.post("/posts/{post_id}/like", response_model=schemas.LikeResponse)
async def like_post(post_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Like a post."""
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(models.Like).filter(models.Like.post_id == post_id, models.Like.user_id == current_user.user_id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Post already liked")
    
    new_like = models.Like(post_id=post_id, user_id=current_user.user_id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)
    return new_like

@router.delete("/posts/{post_id}/like", response_model=schemas.LikeResponse)
async def unlike_post(post_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Unlike a post."""
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(models.Like).filter(models.Like.post_id == post_id, models.Like.user_id == current_user.user_id).first()
    if existing_like is None:
        raise HTTPException(status_code=400, detail="Post not liked yet")
    
    db.delete(existing_like)
    db.commit()
    return existing_like

# Create Post Endpoint
@router.post("/posts/", response_model=schemas.PostResponse)
async def create_post(post: schemas.PostCreate, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Create a new post."""
    new_post = models.Post(content=post.content, image=post.image, user_id=current_user.user_id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# Comment Routes
@router.post("/posts/{post_id}/comments/", response_model=schemas.CommentResponse)
async def create_comment(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Create a new comment on a post."""
    new_comment = models.Comment(content=comment.content, post_id=post_id, user_id=current_user.user_id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/posts/{post_id}/comments/", response_model=List[schemas.CommentResponse])
async def get_comments(post_id: int, db: Session = Depends(get_db)):
    """Get all comments for a specific post."""
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    return comments

@router.delete("/comments/{comment_id}", response_model=dict)
async def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    """Delete a comment."""
    comment = db.query(models.Comment).filter(models.Comment.comment_id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully", "comment_id": comment_id}

# Follow Routes
@router.post("/users/{user_id}/follow", response_model=schemas.FollowResponse)
async def follow_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Follow a user."""
    if current_user.user_id == user_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself.")
    
    user_to_follow = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user_to_follow is None:
        raise HTTPException(status_code=404, detail="User not found.")
    
    existing_follow = db.query(models.Follow).filter(models.Follow.follower_id == current_user.user_id, models.Follow.followed_id == user_id).first()
    if existing_follow:
        raise HTTPException(status_code=400, detail="You are already following this user.")
    
    new_follow = models.Follow(follower_id=current_user.user_id, followed_id=user_id)
    db.add(new_follow)
    db.commit()
    db.refresh(new_follow)
    return new_follow

@router.delete("/users/{user_id}/unfollow", response_model=dict)
async def unfollow_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Unfollow a user."""
    if current_user.user_id == user_id:
        raise HTTPException(status_code=400, detail="You cannot unfollow yourself.")
    
    follow = db.query(Follow).filter(Follow.follower_id == current_user.user_id, Follow.followed_id == user_id).first()
    if follow is None:
        raise HTTPException(status_code=404, detail="Follow relationship not found")
    
    db.delete(follow)
    db.commit()

# Favorite Routes
@router.post("/posts/{post_id}/favorites/", response_model=schemas.FavoriteResponse)
async def create_favorite(post_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Favorite a post."""
    new_favorite = models.Favorite(post_id=post_id, user_id=current_user.user_id)
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@router.get("/users/me/favorites/", response_model=List[schemas.FavoriteResponse])
async def get_favorites(db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Get all favorites for the current user."""
    favorites = db.query(models.Favorite).filter(models.Favorite.user_id == current_user.user_id).all()
    return favorites

@router.delete("/favorites/{favorite_id}", response_model=dict)
async def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    """Delete a favorite."""
    favorite = db.query(models.Favorite).filter(models.Favorite.favorite_id == favorite_id).first()
    if favorite is None:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite deleted successfully", "favorite_id": favorite_id}

@router.get("/posts/", response_model=PostResponse)
async def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get paginated posts."""
    posts = db.query(models.Post).offset(skip).limit(limit).all()
    total_posts = db.query(models.Post).count()  # Get total count of posts
    next_page = skip + limit if skip + limit < total_posts else None  # Calculate next page

    return {
        "items": posts,
        "totalPosts": total_posts,  # Return total number of posts
        "nextPage": next_page,  # Return next page number or None
    }

@router.get("/users/suggestions/", response_model=List[UserResponse])
async def get_user_suggestions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get user follow suggestions based on collaborative filtering.
    """
    suggestions = get_follow_suggestions(current_user.user_id, db)
    return suggestions

# Update Post Endpoint
@router.put("/posts/{post_id}", response_model=schemas.PostResponse)
async def update_post(post_id: int, post: PostCreate, db: Session = Depends(get_db)):
    """Update a post."""
    db_post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Update post details
    db_post.content = post.content
    db_post.image = post.image
    db.commit()
    db.refresh(db_post)
    return db_post

# Update Comment Endpoint
@router.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(comment_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    """Update a comment."""
    db_comment = db.query(models.Comment).filter(models.Comment.comment_id == comment_id).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Update comment details
    db_comment.content = comment.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.post("/posts/{post_id}/share", response_model=dict)
async def share_post(post_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """Share a post."""
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    # Create a new share entry
    new_share = models.Share(post_id=post_id, user_id=current_user.user_id)
    db.add(new_share)
    db.commit()
    db.refresh(new_share)

    return {"message": "Post shared successfully", "post_id": post_id}


@router.get("/posts/{post_id}/shares/", response_model=List[schemas.ShareResponse])
async def get_shares(post_id: int, db: Session = Depends(get_db)):
    """Get all shares for a specific post."""
    shares = db.query(models.Share).filter(models.Share.post_id == post_id).all()
    return shares



@router.post("/posts/{post_id}/shares/", response_model=list[ShareResponse])
async def create_share(post_id: int, share: ShareCreate, db: Session = Depends(get_db)):
    """Create a new share."""
    new_share = models.Share(post_id=post_id, **share.model_dump())
    db.add(new_share)
    db.commit()
    db.refresh(new_share)
    return new_share

@router.get("/business/{listing_id}/shares/", response_model=list[ShareResponse])
async def get_business_shares(listing_id: int, db: Session = Depends(get_db)):
    """Get all shares for a specific business."""
    shares = db.query(models.Share).filter(models.Share.business_id == listing_id).all()
    return shares

@router.post("/business/{listing_id}/shares/", response_model=list[ShareResponse])
async def create_business_share(listing_id: int, share: ShareCreate, db: Session = Depends(get_db)):
    """Create a new share for a specific business."""
    new_share = models.Share(business_id=listing_id, **share.model_dump())
    db.add(new_share)
    db.commit()
    db.refresh(new_share)
    return new_share
