'use client'

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store'; // Import the store
import { apiRequest } from '@/utils/api'; // Ensure this import is correct
import { BusinessCard } from '@/components/business-card';
import { PostCard } from '@/components/post-card';
import { CreatePostPlaceholder } from '@/components/create-post-placeholder';
import { FollowSuggestions } from '@/components/follow-suggestions';

import { BusinessValueDrawer } from '@/components/business-value-drawer';
import { LeftSidebar } from '@/components/left-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from 'next-auth';


export function Browse() {
  const { fetchPosts, fetchFollowSuggestions, fetchBusinesses, followSuggestions, businesses, posts } = useStore(); // Use the store functions
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 100]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(0); // Track total pages

  // Function to fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const user = await apiRequest<User>('/users/me/', 'GET');
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Function to fetch posts based on the current page
  const loadPosts = async (page: number) => {
    try {
      const response = await fetchPosts(page); // Fetch posts for the current page
      setTotalPages(response.totalPages); // Assuming the response contains total pages
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Fetch current user on mount
    fetchFollowSuggestions(); // Fetch follow suggestions on mount
    loadPosts(currentPage); // Fetch posts for the initial page
    fetchBusinesses(); // Fetch businesses on mount
  }, [currentPage]); // Re-fetch posts when currentPage changes

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
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            {currentPage < totalPages && ( // Show Load More button if there are more pages
              <Button onClick={() => setCurrentPage(currentPage + 1)}>Load More</Button>
            )}
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
