export interface Post {
  post_id: number; // Unique identifier for the post
  content: string; // Content of the post
  image?: string; // Optional image URL
  created_at: Date; // Date when the post was created
  user_id: number; // ID of the user who created the post
}

export interface PostResponse {
  items: Post[]; // Array of posts
  nextPage: number | null; // Next page number or null
} 