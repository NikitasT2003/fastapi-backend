export interface Comment {
  comment_id: number; // Unique identifier for the comment
  content: string; // Content of the comment
  created_at: Date; // Date when the comment was created
  post_id: number; // ID of the post the comment belongs to
  user_id: number; // ID of the user who made the comment
} 