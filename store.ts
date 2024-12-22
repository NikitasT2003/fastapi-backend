import { create, UseBoundStore } from "zustand";
import { apiRequest } from "@/utils/api";
export type Users = {
  user_id: number; // User ID of the user
  username: string; // Username of the user
  email: string; // Email of the user
  password: string; // Password of the user (hashed)s
  is_seller: boolean; // Indicates if the user is a seller
  is_admin?: boolean; // Indicates if the user is an admin
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

export interface Shares {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
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
  createPost: (postData: Omit<Post, "user_id" | "created_at" | "post_id"> & { user_id: number; }) =>Promise<Post> ; 
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
  likeBusiness: (listingId: number) => Promise<any>;
  unlikeBusiness: (listingId: number) => Promise<any>;
  fetchBusinessLikeCount: (listingId: number) => Promise<number>;
  businessLikes: any[] | string | null;
  shares: any[] | string | null;
  businessShares: any[] | string | null;
};

const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:8000/api";

export const useStore = create<AuthStore>((set) => ({
  currentUser: null,
  posts: [],
  followSuggestions: null,
  businesses: [],
  comments: [],
  likes: [],
  users: [],
  shares: [] ,
  businessShares: [],
  businessLikes: [],

  fetchShares: async (postId: number) => {
    try {
      const data: Shares[] = await apiRequest(`/posts/${postId}/shares/`, 'GET');
      set({ shares: data });
    } catch (error) {
      console.error("Error fetching shares:", error);
    }
  },
  
  fetchCurrentUser: async (): Promise<Users | null> => {
    try {
      const user: Users = await apiRequest(`/users/me/`, 'GET');
      set({ currentUser: user });
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  registerUser: async (userData: Omit<Users, 'user_id' | 'created_at'> & { password: string }) => {
    try {
      await apiRequest(`/signup`, 'POST', userData);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  },

  loginUser: async (username, password) => {
    try {
      const tokenData = await apiRequest(`/login`, 'POST', { username, password });
      console.log("Logged in successfully:", tokenData);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  },

  fetchPosts: async (pageParam = 0) => {
    try {
      const data: { items: Post[] } = await apiRequest(`/posts?skip=${pageParam}&limit=10`, 'GET');
      set((state) => ({ posts: [...state.posts, ...data.items] }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },
  fetchFollowSuggestions: async () => {
    try {
      const data: Suggestion[] = await apiRequest(`/users/suggestions/`, 'GET');
      set({ followSuggestions: data });
    } catch (error) {
      console.error("Error fetching follow suggestions:", error);
    }
  },

  fetchBusinesses: async (pageParam = 0) => {
    const skip = pageParam * 10; // Assuming 10 businesses per page
    try {
      const data: { items: Business[] } = await apiRequest(`/business?skip=${skip}&limit=10`, 'GET');
      set({ businesses: data.items });
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  },
  
  fetchComments: async (postId) => {
    try {
      const data: Comment[] = await apiRequest(`/posts/${postId}/comments/`, 'GET');
      set({ comments: data });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  },
  
  fetchLikes: async (postId) => {
    try {
      const data: Like[] = await apiRequest(`/posts/${postId}/likes/count`, 'GET');
      set({ likes: data });
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  },

  fetchUsers: async () => {
    try {
      const data: Users[] = await apiRequest(`/user/`, 'GET');
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  fetchUserById: async (userId: number): Promise<Users> => {
    try {
      const data: Users = await apiRequest(`/user/${userId}`, 'GET');
      if (!data) {
        throw new Error("User not found"); // Throw an error if user is not found
      }
      return data; // Return user data
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error; // Rethrow the error to ensure the return type is consistent
    }
  },

  updateUser: async (userId: number, userData: Partial<Users>): Promise<Users> => {
    try {
      const updatedUser: Users = await apiRequest(`/user/${userId}`, 'PUT', userData);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await apiRequest(`/user/${userId}`, 'DELETE');
      return { message: "User deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting user:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  createPost: async (postData: Omit<Post, "user_id" | "created_at" | "post_id"> & { user_id: number; }): Promise<Post> => {
    try {
      const newPost: Post = await apiRequest(`/posts/`, 'POST', postData); // Specify the type
      return newPost; // Return created post data
    } catch (error) {
      console.error("Error creating post:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  deletePost: async (postId) => {
    try {
      await apiRequest(`/posts/${postId}`, 'DELETE');
      return { message: "Post deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting post:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  followUser: async (userId) => {
    try {
      await apiRequest(`/users/${userId}/follow`, 'POST');
      return { message: "Followed successfully" }; // Return success message
    } catch (error) {
      console.error("Error following user:", error);
      return { message: "Follow failed" }; // Return a default message or handle the error appropriately
    }
  },

  unfollowUser: async (userId) => {
    try {
      await apiRequest(`/users/${userId}/unfollow`, 'DELETE');
      return { message: "Unfollowed successfully" }; // Return success message
    } catch (error) {
      console.error("Error unfollowing user:", error);
      return { message: "Unfollow failed" }; // Return a default message or handle the error appropriately
    }
  },

  createFavorite: async (postId) => {
    try {
      const newFavorite = await apiRequest(`/posts/${postId}/favorites/`, 'POST');
      return newFavorite; // Return created favorite data
    } catch (error) {
      console.error("Error creating favorite:", error);
    }
  },

  getFavorites: async () => {
    try {
      const data = await apiRequest(`/users/me/favorites/`, 'GET');
      return data; // Return favorites data
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  },

  deleteFavorite: async (favoriteId) => {
    try {
      await apiRequest(`/favorites/${favoriteId}`, 'DELETE');
      return { message: "Favorite deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting favorite:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  updatePost: async (postId: number, postData: Partial<Post>): Promise<Post> => {
    try {
      const updatedPost: Post = await apiRequest(`/posts/${postId}`, 'PUT', postData); // Specify the type
      return updatedPost; // Return updated post data
    } catch (error) {
      console.error("Error updating post:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  updateComment: async (commentId: number, commentData: Partial<Comment>): Promise<Comment> => {
    try {
      const updatedComment: Comment = await apiRequest(`/comments/${commentId}`, 'PUT', commentData); // Specify the type
      return updatedComment; // Return updated comment data
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  createComment: async (postId: number, commentData: Omit<Comment, "created_at">): Promise<Comment> => {
    try {
      const newComment: Comment = await apiRequest(`/posts/${postId}/comments/`, 'POST', commentData); // Specify the type
      return newComment; // Return created comment data
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  createBusiness: async (businessData: Omit<Business, "created_at">): Promise<Business> => {
    try {
      const newBusiness: Business = await apiRequest(`/business/`, 'POST', businessData); // Specify the type
      return newBusiness; // Return created business data
    } catch (error) {
      console.error("Error creating business:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  fetchBusiness: async (businessId: number): Promise<Business> => {
    try {
      const business: Business = await apiRequest(`/business/${businessId}`, 'GET'); // Specify the type
      return business; // Return business data
    } catch (error) {
      console.error("Error fetching business:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  updateBusiness: async (businessId: number, businessData: Partial<Business>): Promise<Business> => {
    try {
      const updatedBusiness: Business = await apiRequest(`/business/${businessId}`, 'PUT', businessData); // Specify the type
      return updatedBusiness; // Return updated business data
    } catch (error) {
      console.error("Error updating business:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  deleteBusiness: async (businessId) => {
    try {
      await apiRequest(`/business/${businessId}`, 'DELETE');
      return { message: "Business deleted successfully" }; // Return success message
    } catch (error) {
      console.error("Error deleting business:", error);
      return { message: "Delete failed" }; // Return a default message or handle the error appropriately
    }
  },

  likePost: async (postId) => {
    try {
      const likeData = await apiRequest(`/posts/${postId}/like`, 'POST');
      return likeData; // Return like data
    } catch (error) {
      console.error("Error liking post:", error);
    }
  },

  unlikePost: async (postId) => {
    try {
      const unlikeData = await apiRequest(`/posts/${postId}/like`, 'DELETE');
      return unlikeData; // Return unlike data
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  },

  fetchLikeCount: async (postId: number): Promise<number> => {
    try {
      const likeCount: number = await apiRequest(`/posts/${postId}/likes/count`, 'GET');
      return likeCount; // Return like count
    } catch (error) {
      console.error("Error fetching like count:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  fetchUserSuggestions: async (): Promise<Suggestion[]> => {
    try {
      const suggestions: Suggestion[] = await apiRequest(`/users/suggestions/`, 'GET'); // Specify the type
      return suggestions; // Return user suggestions
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },

  createShare: async (postId: number) => {
    try {
      const newShare = await apiRequest(`/posts/${postId}/shares/`, 'POST', {});
      return newShare; // Return the created share
    } catch (error) {
      console.error("Error creating share:", error);
    }
  },

  createBusinessShare: async (listingId: number) => {
    try {
      const newShare = await apiRequest(`/business/${listingId}/shares/`, 'POST', {});
      return newShare; // Return the created business share
    } catch (error) {
      console.error("Error creating business share:", error);
    }
  },

  fetchBusinessShares: async (listingId: number) => {
    try {
      const data = await apiRequest<Shares[]>(`/business/${listingId}/shares/`, 'GET');
      set({ businessShares: data });
    } catch (error) {
      console.error("Error fetching business shares:", error);
    }
  },

  likeBusiness: async (listingId: number) => {
    try {
      const result = await apiRequest(`/business/${listingId}/likes/`, 'POST');
      return result; // Return the result of the like action
    } catch (error) {
      console.error("Error liking business:", error);
    }
  },

  unlikeBusiness: async (listingId: number) => {
    try {
      const result = await apiRequest(`/business/${listingId}/unlike`, 'DELETE');
      return result; // Return the result of the unlike action
    } catch (error) {
      console.error("Error unliking business:", error);
    }
  },

  fetchBusinessLikeCount: async (listingId: number): Promise<number> => {
    try {
      const likeCount: number = await apiRequest(`/business/${listingId}/likes/count`, 'GET');
      return likeCount; // Return like count
    } catch (error) {
      console.error("Error fetching business like count:", error);
      throw error; // Rethrow the error to maintain type consistency
    }
  },
}));