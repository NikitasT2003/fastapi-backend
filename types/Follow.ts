export interface Follow {
  follow_id: number; // Unique identifier for the follow relationship
  follower_id: number; // ID of the user who follows
  followed_id: number; // ID of the user being followed
  created_at: Date; // Date when the follow relationship was created
} 