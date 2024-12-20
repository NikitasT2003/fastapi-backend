import { create } from "zustand";

type User = {
  user_id: number;
  username: string;
  email: string;
  name: string;
  profile_picture?: string;
  is_seller: boolean;
  is_admin: boolean;
  created_at: string;
};

type Post = {
  post_id: number;
  content: string;
  image?: string;
  created_at: string;
  user_id: number;
};

type AuthStore = {
  currentUser: User | null;
  fetchCurrentUser: () => Promise<void>;
  registerUser: (userData: Omit<User, 'user_id' | 'created_at'> & { password: string }) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<void>;
  posts: Post[];
  fetchPosts: (pageParam?: number) => Promise<void>;
};

const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:3000/api";

export const useStore = create<AuthStore>((set) => ({
  currentUser: null,
  posts: [],
  
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
      // Store the token in local storage or state as needed
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
}));