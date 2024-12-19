from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func  
from database import get_db
from models import User, Like, Follow
from typing import List
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

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
