'use client'

import React, { useEffect, useState } from 'react';
import { Users, useStore } from '@/store'; // Import the store
import { PostCard } from '@/components/post-card';
import { CreatePostPlaceholder } from '@/components/create-post-placeholder';
import { FollowSuggestions } from '@/components/follow-suggestions';
import { BusinessValueDrawer } from '@/components/business-value-drawer';
import { LeftSidebar } from '@/components/left-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Browse() {
  const { likePost, followUser, createShare, createComment, fetchFollowSuggestions, fetchBusinesses, posts, fetchCurrentUser, createPost } = useStore();
  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 100]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const fetchCurrentUserData = async () => {
    const user = await fetchCurrentUser(); // Await the promise
    if (user) {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    fetchCurrentUserData(); // Fetch current user on mount
    fetchFollowSuggestions(); // Fetch follow suggestions on mount
    fetchBusinesses(currentPage); // Fetch businesses on mount
  }, [fetchCurrentUserData, fetchFollowSuggestions, fetchBusinesses, currentPage]); // Add all dependencies

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex min-h-screen">
      <LeftSidebar user={currentUser} />
      <main className="flex-1 border-x border-gray-200 min-h-screen">
        <div className="max-w-[672px] mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Browse MarketPlace</h1>
          <div className="mb-6">
            <BusinessValueDrawer budgetRange={budgetRange} setBudgetRange={setBudgetRange} />
          </div>
          <CreatePostPlaceholder
            user={currentUser}
            onCreatePost={handleCreatePost}
            onCreateListing={handleCreateListing}
          />
          <div className="space-y-6 mt-6">
            {posts.map((post) => (
              <PostCard
                key={post.id} // Add a unique key prop
                post={post}
                onLike={handleLike}
                onComment={(postId) => handleCreateComment(postId, {/* commentData */})}
                onShare={handleShare}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            {currentPage < totalPages && (
              <Button onClick={() => setCurrentPage(currentPage + 1)}>Load More</Button>
            )}
          </div>
        </div>
      </main>
      <aside className="w-80 p-4 hidden lg:block">
        <div className="sticky top-4 space-y-4">
          <FollowSuggestions suggestions={followSuggestions} onFollow={(userId) => handleFollow(Number(userId))} />
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
