export interface Like {
  like_id: number; // Unique identifier for the like
  post_id: number; // ID of the post that was liked
  user_id: number; // ID of the user who liked the post
  created_at: Date; // Date when the like was created
} 