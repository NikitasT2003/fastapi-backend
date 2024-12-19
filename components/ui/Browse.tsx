'use client'

import React, { useEffect, useState } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiRequest } from '@/utils/api'; // Adjust the import path as necessary
import { BusinessCard } from '@/components/business-card';
import { PostCard } from '@/components/post-card';
import { CreatePostPlaceholder } from '@/components/create-post-placeholder';
import { FollowSuggestions } from '@/components/follow-suggestions';
import { Business } from '@/types/business';
import { Post , PostResponse } from '@/types/posts';
import { UserDisplay } from '@/types/UserDisplay'; // Adjust the import path as necessary
import { Suggestion } from '@/types/Suggestion'; // Import the Suggestion type
import { BusinessValueDrawer } from '@/components/business-value-drawer'; // Import the BusinessValueDrawer component
import { useInView } from 'react-intersection-observer'
import { LeftSidebar } from '@/components/left-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Users } from '@/types/Users';
import Link from 'next/link';


export function Browse() {
  const [currentUser, setCurrentUser] = useState<Users | null>(null); // State to hold the current user
  const [followSuggestions, setFollowSuggestions] = useState<Suggestion[]>([]); // State for follow suggestions
  const [posts, setPosts] = useState<Post[]>([]); // Declare the state variable for posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]); // Define the state for businesses
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 100]); // Declare budgetRange state

  // Function to fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const user = await apiRequest('/users/me/', 'GET');
      setCurrentUser(user as Users); // Set the current user state
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Call the function when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch follow suggestions
  const fetchFollowSuggestions = async () => {
    try {
      const users = await apiRequest<Users[]>('/users/suggestions/', 'GET');
      // Transform User[] to Suggestion[]
      const suggestions: Suggestion[] = users.map(user => ({
        id: String(user.user_id),
        name: user.username,
        avatar: user.profile_picture || '/placeholder.svg',
        username: user.username,
      }));
      setFollowSuggestions(suggestions);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch posts
  const fetchPosts = async ({ pageParam = 0 }) => {
    try {
      const response = await apiRequest<Post[]>(`/posts?skip=${pageParam}&limit=10`, 'GET');
      setPosts(response); // Now this will work
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchFollowSuggestions(); // Call the function when the component mounts
    fetchPosts({ pageParam: 0 }); // Call fetchPosts to load initial posts
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Define the required functions
  const handleCreatePost = (postData: Post) => {
    // Logic to handle post creation
    console.log("Post created:", postData);
  };

  const handleCreateListing = (listingData: Business): void => {
    // Logic to handle listing creation
    console.log("Listing created:", listingData);
  };

  // Define the onFollow function
  const handleFollow = (userId: string): void => {
    // Logic to handle following a user
    console.log("Followed user with ID:", userId);
  };

  const handleLike = (postId: string) => {
    // Logic to handle liking a post
    console.log("Liked post with ID:", postId);
  };

  const handleShare = (postId: string) => {
    // Logic to handle sharing a post
    console.log("Shared post with ID:", postId);
  };

  const handleComment = (postId: string) => {
    // Logic to handle commenting on a post
    console.log("Commented on post with ID:", postId);
  };

  const handleFavorite = (businessId: string) => {
    // Logic to handle favoriting a business
    console.log("Favorited business with ID:", businessId);
  };

  const handleMessage = (ownerId: string) => {
    // Logic to handle messaging an owner
    console.log("Messaged owner with ID:", ownerId);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    PostResponse, // Use the PostResponse type
    unknown
  >(
    ['posts'], // Query key
    async ({ pageParam = 0 }) => {
      const response = await apiRequest<PostResponse>(
        `/posts?skip=${pageParam}&limit=10`,
        'GET'
      );
      return response; // Return the entire response
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage, // Correctly specify the next page parameter
    }
  );

  if (isFetchingNextPage) return <p>Loading more...</p>;
  if (!data) return <p>No posts available.</p>;

  return (
    <div className="flex min-h-screen">
      <LeftSidebar user={currentUser ? {
        profile_picture: currentUser.profile_picture || '',
        name: currentUser.name,
        username: currentUser.username,
        created_at: currentUser.created_at,
        description: currentUser.description || ''
      } : null} />
      <main className="flex-1 border-x border-gray-200 min-h-screen">
        <div className="max-w-[672px] mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Browse MarketPlace</h1>

          <div className="mb-6">
            <BusinessValueDrawer budgetRange={budgetRange} setBudgetRange={setBudgetRange} />
          </div>

          <CreatePostPlaceholder
            user={currentUser ? {
              name: currentUser.name,
              avatar: currentUser.profile_picture || '',
              user_id: currentUser.user_id,
            } : null}
            onCreatePost={handleCreatePost}
            onCreateListing={handleCreateListing}
          />

          <div className="space-y-6 mt-6">
            {data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.items.map((item: Post) => (
                  'author' in item ? (
                    <PostCard
                      key={item.id}
                      post={item}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ) : (
                    <BusinessCard
                      key={item.id}
                      business={item}
                      onClick={handleBusinessClick}
                    />
                  )
                ))}
              </React.Fragment>
            ))}
            <div className="mt-8 text-center">
              {isFetchingNextPage ? (
                <p>Loading more...</p>
              ) : hasNextPage ? (
                <Button onClick={() => fetchNextPage()}>Load More</Button>
              ) : (
                <p>No more posts to load.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <aside className="w-80 p-4 hidden lg:block">
  <div className="sticky top-4 space-y-4">
    <FollowSuggestions suggestions={followSuggestions} onFollow={handleFollow} />
    <div className="text-sm text-gray-500 space-y-2">
      <div className="flex flex-wrap gap-2">
        <Link href="#" className="hover:underline">About</Link>
        <Link href="#" className="hover:underline">Help</Link>
        <Link href="#" className="hover:underline">Press</Link>
        <Link href="#" className="hover:underline">API</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="#" className="hover:underline">Jobs</Link>
        <Link href="#" className="hover:underline">Privacy</Link>
        <Link href="#" className="hover:underline">Terms</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="#" className="hover:underline">Locations</Link>
        <Link href="#" className="hover:underline">Language</Link>
        <Link href="#" className="hover:underline">Verified Accounts</Link>
      </div>
      <p>© 2024 MarketPlace</p>
    </div>
  </div>
</aside>
    </div>
  );
}

export default Browse; 
