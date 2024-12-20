import { create } from "zustand";

type Users = {
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

type Post = {
  post_id: number;
  content: string;
  image?: string;
  created_at: string;
  user_id: number;
};

type Business = {
  listing_id: number; // Unique identifier for the business listing
  title: string; // Title of the business
  description: string; // Description of the business
  price: number; // Price of the business listing
  industry?: string[]; // Optional array of industries
  created_at: Date; // Date when the business was created
  seller_id: number; // ID of the user who is the seller
  logo?: string; // Optional URL for the business logo
  banner?: string; // Optional URL for the business banner
}
type Comment = {
  comment_id: number; // Unique identifier for the comment
  content: string; // Content of the comment
  created_at: Date; // Date when the comment was created
  post_id: number; // ID of the post the comment belongs to
  user_id: number; // ID of the user who made the comment
} 

type Follow = {
  follow_id: number; // Unique identifier for the follow relationship
  follower_id: number; // ID of the user who follows
  followed_id: number; // ID of the user being followed
  created_at: Date; // Date when the follow relationship was created
} 
type Like = {
  like_id: number; // Unique identifier for the like
  post_id: number; // ID of the post that was liked
  user_id: number; // ID of the user who liked the post
  created_at: Date; // Date when the like was created
} 
export interface Suggestion {
  id: string; // Ensure this is a string
  name: string; // Required name property
  avatar: string; // Required avatar property
  username: string; // Make this a required property
}


type AuthStore = {
  currentUser: Users | null;
  fetchCurrentUser: () => Promise<void>;
  registerUser: (userData: Omit<Users, 'user_id' | 'created_at'> & { password: string }) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<void>;
  posts: Post[];
  fetchPosts: (pageParam?: number) => Promise<void>;
  followSuggestions: Suggestion[] | null;
  fetchFollowSuggestions: () => Promise<void>;
  businesses: Business[];
  fetchBusinesses: () => Promise<void>;
  comments: Comment[];
  fetchComments: (postId: number) => Promise<void>;
  likes: Like[];
  fetchLikes: (postId: number) => Promise<void>;
  users: Users[];
  fetchUsers: () => Promise<void>;
  fetchUserById: (userId: number) => Promise<Users>;
  updateUser: (userId: number, userData: Partial<Users>) => Promise<Users>;
  deleteUser: (userId: number) => Promise<{ message: string }>;
  createPost: (postData: Omit<Post, 'post_id' | 'created_at' | 'user_id'> & { user_id: number }) => Promise<Post>;
  deletePost: (postId: number) => Promise<{ message: string }>;
  followUser: (userId: number) => Promise<{ message: string }>;
  unfollowUser: (userId: number) => Promise<{ message: string }>;
  createFavorite: (postId: number) => Promise<any>;
  getFavorites: () => Promise<any>;
  deleteFavorite: (favoriteId: number) => Promise<{ message: string }>;
  updatePost: (postId: number, postData: Partial<Post>) => Promise<Post>;
  updateComment: (commentId: number, commentData: Partial<Comment>) => Promise<Comment>;
};

const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:3000/api";

export const useStore = create<AuthStore>((set) => ({
  currentUser: null,
  posts: [],
  followSuggestions: null,
  
  fetchCurrentUser: async () => {
    try {
      const response = await fetch(`${URL}/users/me/`);
      const user = await response.json();
      set({ currentUser: user });
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const newUser = await response.json();
      set({ currentUser: newUser });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  },

  loginUser: async (username, password) => {
    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const tokenData = await response.json();
      console.log("Logged in successfully:", tokenData);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  },

  fetchPosts: async (pageParam = 0) => {
    try {
      const response = await fetch(`${URL}/posts?skip=${pageParam}&limit=10`);
      const data = await response.json();
      set((state) => ({ posts: [...state.posts, ...data.items] }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },
  fetchFollowSuggestions: async () => {
    try {
      const response = await fetch(`${URL}/users/suggestions/`);
      const data = await response.json();
      set({ followSuggestions: data });
    } catch (error) {
      console.error("Error fetching follow suggestions:", error);
    }
  },

  businesses: [],
  fetchBusinesses: async () => {
    try {
      const response = await fetch(`${URL}/business/`);
      const data = await response.json();
      set({ businesses: data });
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  },
  
  comments: [],
  fetchComments: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/comments/`);
      const data = await response.json();
      set({ comments: data });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  },
  
  likes: [],
  fetchLikes: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/likes/count`);
      const data = await response.json();
      set({ likes: data });
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  },

  users: [],
  fetchUsers: async () => {
    try {
      const response = await fetch(`${URL}/user/`);
      const data = await response.json();
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  fetchUserById: async (userId) => {
    try {
      const response = await fetch(`${URL}/user/${userId}`);
      const data = await response.json();
      return data; // Return user data
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      const updatedUser = await response.json();
      return updatedUser; // Return updated user data
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${URL}/user/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      return { message: "User deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting user:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  createPost: async (postData) => {
    try {
      const response = await fetch(`${URL}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error("Post creation failed");
      }
      const newPost = await response.json();
      return newPost; // Return created post data
    } catch (error) {
      console.error("Error creating post:", error);
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      return { message: "Post deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting post:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  followUser: async (userId) => {
    try {
      const response = await fetch(`${URL}/users/${userId}/follow`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Follow failed");
      }
      return { message: "Followed successfully" }; // Return success message
    } catch (error) {
      console.error("Error following user:", error);
      return { message: "Follow failed" }; // Return a default message or handle the error appropriately
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await fetch(`${URL}/users/${userId}/unfollow`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Unfollow failed");
      }
      return { message: "Unfollowed successfully" }; // Return success message
    } catch (error) {
      console.error("Error unfollowing user:", error);
      return { message: "Unfollow failed" }; // Return a default message or handle the error appropriately
    }
  },

  createFavorite: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/favorites/`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Favorite creation failed");
      }
      const newFavorite = await response.json();
      return newFavorite; // Return created favorite data
    } catch (error) {
      console.error("Error creating favorite:", error);
    }
  },

  getFavorites: async () => {
    try {
      const response = await fetch(`${URL}/users/me/favorites/`);
      const data = await response.json();
      return data; // Return favorites data
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  },

  deleteFavorite: async (favoriteId) => {
    try {
      const response = await fetch(`${URL}/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      return { message: "Favorite deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting favorite:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  updatePost: async (postId, postData) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error("Update post failed");
      }
      const updatedPost = await response.json();
      return updatedPost; // Return updated post data
    } catch (error) {
      console.error("Error updating post:", error);
    }
  },

  updateComment: async (commentId, commentData) => {
    try {
      const response = await fetch(`${URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error("Update comment failed");
      }
      const updatedComment = await response.json();
      return updatedComment; // Return updated comment data
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  },
}));