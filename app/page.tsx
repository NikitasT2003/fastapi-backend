"use client"

import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { EmailSubscribe } from '@/components/ui/EmailSubscribe'
import { BusinessCard } from '@/components/business-card'
import { useStore } from '@/store';
import { useState } from 'react'
export default function Businesses() {
  const { fetchBusinesses, likeBusiness, unlikeBusiness, fetchLikes, createFavorite } = useStore();

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleBusinessLike = async (listingId: number) => {
    try {
      await likeBusiness(listingId);
    } catch (error) {
      console.error("Error liking business:", error);
    }
  };

  const handleBusinessUnlike = async (listingId: number) => {
    try {
      await unlikeBusiness(listingId);
    } catch (error) {
      console.error("Error unliking business:", error);
    }
  };

  const handleFavorite = (listingId: number) => {
    createFavorite(listingId);
  };

  const handleMessage = (ownerId: string) => {
    console.log(`Message owner with id: ${ownerId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center my-8">Welcome to BusinessMarket</h1>
          <p className="text-center text-xl mb-8">Your platform for buying and selling businesses</p>
          
        </div>
      </main>
      <EmailSubscribe />
      <Footer />
    </div>
  )
}
