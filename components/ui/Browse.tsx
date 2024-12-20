'use client'

import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiRequest } from '@/utils/api'; // Ensure this import is correct
import { BusinessCard } from '@/components/business-card';
import { PostCard } from '@/components/post-card';
import { CreatePostPlaceholder } from '@/components/create-post-placeholder';
import { FollowSuggestions } from '@/components/follow-suggestions';
import { Business } from '@/types/business';
import { Post, PostResponse } from '@/types/posts';
import { UserDisplay } from '@/types/UserDisplay';
import { Suggestion } from '@/types/Suggestion';
import { BusinessValueDrawer } from '@/components/business-value-drawer';
import { LeftSidebar } from '@/components/left-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from 'next-auth';
import { Users } from '@/types/Users';

export function Browse() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [followSuggestions, setFollowSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 100]);

  // Function to fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const user = await apiRequest<User>('/users/me/', 'GET');
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Function to fetch follow suggestions
  const fetchFollowSuggestions = async () => {
    try {
      const users = await apiRequest<Users[]>('/users/suggestions/', 'GET');
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
      const response = await apiRequest<PostResponse>(`/posts?skip=${pageParam}&limit=10`, 'GET');
      return response; // Return the entire response
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Fetch current user on mount
    fetchFollowSuggestions(); // Fetch follow suggestions on mount
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<PostResponse, unknown>(
    ['posts'],
    fetchPosts,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
