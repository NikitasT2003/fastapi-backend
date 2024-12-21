import { create } from "zustand";

export type Users = {
  user_id: number; // User ID of the user
  username: string; // Username of the user
  email: string; // Email of the user
  password: string; // Password of the user (hashed)s
  is_seller: boolean; // Indicates if the user is a seller
  is_admin: boolean; // Indicates if the user is an admin
  profile_picture?: string; // Optional profile picture URL
  created_at: Date; // Date when the user was created
  name: string; // Name of the user
  description?: string; // Optional description of the user
};

export type Post = {
  post_id: string; // Ensure this matches your actual data type
  content: string;
  image: string;
  avatar: string; // Add this line
  author: string; // Ensure this is included
  comments: number; // Ensure this is included
  likes: number; // Ensure this is included
  shares: number; // Ensure this is included
  created_at: string; // Ensure this is included
};

export type Business = {
  seller_id: number;
  title: string;
  description: string;
  price: number;
  industry?: string[];
  created_at: Date;
};

export type Comment = {
  content: string;
  created_at: Date;
};

export  type Follow = {
  follower_id: number; // ID of the user who follows
  followed_id: number; // ID of the user being followed
};

export type Like = {
  post_id: number; // ID of the post that was liked
  user_id: number; // ID of the user who liked the post
};

type Favorite = {
  post_id: number; // ID of the post that was favorited
  user_id: number; // ID of the user who favorited the post
};

export interface Suggestion {
  id: string; // Ensure this is a string
  name: string; // Required name property
  avatar: string; // Required avatar property
  username: string; // Make this a required property
}


type AuthStore = {
  currentUser: Users | null;
  fetchCurrentUser: () => Promise<Users | null>;
  registerUser: (userData: Omit<Users, 'user_id' | 'created_at'> & { password: string }) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<void>;
  posts: Post[];
  fetchPosts: (pageParam?: number) => Promise<void>;
  followSuggestions: Suggestion[] | null;
  fetchFollowSuggestions: () => Promise<void>;
  businesses: Business[];
  fetchBusinesses: (pageParam?: number) => Promise<void>;
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
  createComment: (postId: number, commentData: Omit<Comment, 'created_at'>) => Promise<Comment>;
  createBusiness: (businessData: Omit<Business, 'created_at'>) => Promise<Business>;
  fetchBusiness: (businessId: number) => Promise<Business>;
  updateBusiness: (businessId: number, businessData: Partial<Business>) => Promise<Business>;
  deleteBusiness: (businessId: number) => Promise<{ message: string }>;
  likePost: (postId: number) => Promise<any>;
  unlikePost: (postId: number) => Promise<any>;
  fetchLikeCount: (postId: number) => Promise<number>;
  fetchUserSuggestions: () => Promise<Suggestion[]>;
  createShare: (postId: number) => Promise<any>;
  fetchShares: (postId: number) => Promise<any>;
  createBusinessShare: (listingId: number) => Promise<any>;
  fetchBusinessShares: (listingId: number) => Promise<any>;
  shares: any[];
  businessShares: any[];
};

const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:3000/api";

export const useStore = create<AuthStore>((set) => ({
  currentUser: null,
  posts: [],
  followSuggestions: null,
  businesses: [],
  comments: [],
  likes: [],
  users: [],
  shares: [],
  businessShares: [],

  fetchShares: async (postId: number) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/shares/`);
      const data = await response.json();
      set({ shares: data });
    } catch (error) {
      console.error("Error fetching shares:", error);
    }
  },
  
  fetchCurrentUser: async (): Promise<Users | null> => {
    try {
      const response = await fetch(`${URL}/users/me/`);
      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }
      const user: Users = await response.json();
      set({ currentUser: user });
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
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

  fetchBusinesses: async (pageParam = 0) => {
    const skip = pageParam * 10; // Assuming 10 businesses per page
    try {
        const response = await fetch(`${URL}/business?skip=${skip}&limit=10`);
        const data = await response.json();
        set({ businesses: data.items });
    } catch (error) {
        console.error("Error fetching businesses:", error);
    }
  },
  
  fetchComments: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/comments/`);
      const data = await response.json();
      set({ comments: data });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  },
  
  fetchLikes: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/likes/count`);
      const data = await response.json();
      set({ likes: data });
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  },

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

  createComment: async (postId, commentData) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error("Comment creation failed");
      }
      const newComment = await response.json();
      return newComment; // Return created comment data
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  },

  createBusiness: async (businessData) => {
    try {
      const response = await fetch(`${URL}/business/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      });
      if (!response.ok) {
        throw new Error("Business creation failed");
      }
      const newBusiness = await response.json();
      return newBusiness; // Return created business data
    } catch (error) {
      console.error("Error creating business:", error);
    }
  },

  fetchBusiness: async (businessId) => {
    try {
      const response = await fetch(`${URL}/business/${businessId}`);
      if (!response.ok) {
        throw new Error("Business not found");
      }
      const business = await response.json();
      return business; // Return business data
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  },

  updateBusiness: async (businessId, businessData) => {
    try {
      const response = await fetch(`${URL}/business/${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      });
      if (!response.ok) {
        throw new Error("Update business failed");
      }
      const updatedBusiness = await response.json();
      return updatedBusiness; // Return updated business data
    } catch (error) {
      console.error("Error updating business:", error);
    }
  },

  deleteBusiness: async (businessId) => {
    try {
      const response = await fetch(`${URL}/business/${businessId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete business failed");
      }
      return { message: "Business deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting business:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  likePost: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Like failed");
      }
      const likeData = await response.json();
      return likeData; // Return like data
    } catch (error) {
      console.error("Error liking post:", error);
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/like`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Unlike failed");
      }
      const unlikeData = await response.json();
      return unlikeData; // Return unlike data
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  },

  fetchLikeCount: async (postId) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/likes/count`);
      if (!response.ok) {
        throw new Error("Failed to fetch like count");
      }
      const likeCount = await response.json();
      return likeCount; // Return like count
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  },

  fetchUserSuggestions: async () => {
    try {
      const response = await fetch(`${URL}/users/suggestions/`);
      if (!response.ok) {
        throw new Error("Failed to fetch user suggestions");
      }
      const suggestions = await response.json();
      return suggestions; // Return user suggestions
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
    }
  },

  createShare: async (postId: number) => {
    try {
      const response = await fetch(`${URL}/posts/${postId}/shares/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Add any necessary share data here
      });
      if (!response.ok) {
        throw new Error("Failed to create share");
      }
      const newShare = await response.json();
      return newShare; // Return the created share
    } catch (error) {
      console.error("Error creating share:", error);
    }
  },

  createBusinessShare: async (listingId: number) => {
    try {
      const response = await fetch(`${URL}/business/${listingId}/shares/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Add any necessary share data here
      });
      if (!response.ok) {
        throw new Error("Failed to create business share");
      }
      const newShare = await response.json();
      return newShare; // Return the created business share
    } catch (error) {
      console.error("Error creating business share:", error);
    }
  },

  fetchBusinessShares: async (listingId: number) => {
    try {
      const response = await fetch(`${URL}/business/${listingId}/shares/`);
      const data = await response.json();
      set({ businessShares: data }); // Assuming you want to store business shares in the state
    } catch (error) {
      console.error("Error fetching business shares:", error);
    }
  },
}));