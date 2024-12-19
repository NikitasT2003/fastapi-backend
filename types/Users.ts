export interface Users {
  user_id: number; // Unique identifier for the user
  username: string; // Username of the user
  email: string; // Email of the user
  password: string; // Password of the user (hashed)
  is_seller: boolean; // Indicates if the user is a seller
  is_admin: boolean; // Indicates if the user is an admin
  profile_picture?: string; // Optional profile picture URL
  created_at: Date;
  name: string;
  description?: string;
} 