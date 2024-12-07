"use client"

import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { EmailSubscribe } from '@/components/ui/EmailSubscribe'
import { BusinessCard } from '@/components/business-card'

export default function Businesses() {
  const business = {
    id: '1',
    title: 'Sample Business',
    description: 'This is a sample business description.',
    price: 100000,
    industry: ['Retail'],
    createdAt: new Date(),
    seller: {
      user_id: 'seller123',
    },
    logo: 'https://www.svg.com/logo.svg',
    banner: 'https://www.svg.com/banner.svg',
  };

  const handleLike = (id: string) => {
    console.log(`Liked business with id: ${id}`);
  };

  const handleFavorite = (id: string) => {
    console.log(`Favorited business with id: ${id}`);
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
          <BusinessCard 
            business={business} 
            onLikeAction={handleLike} 
            onFavoriteAction={handleFavorite} 
            onMessageAction={handleMessage} 
          />
        </div>
      </main>
      <EmailSubscribe />
      <Footer />
    </div>
  )
}
