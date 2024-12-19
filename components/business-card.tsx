'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Business } from '@/types/business'
import { Badge } from '@/components/ui/badge'

interface BusinessCardProps {
  business: Business;
  onLikeAction: (id: string) => void;
  onFavoriteAction: (id: string) => void;
  onMessageAction: (ownerId: string) => void;
}

export function BusinessCard({ business, onLikeAction, onFavoriteAction, onMessageAction }: BusinessCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLikeAction(String(business.listing_id))
  }

  const handleFavorite = () => {
    onFavoriteAction(String(business.listing_id))
  }

  const handleMessage = () => {
    onMessageAction(String(business.seller_id))
  }

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={business.banner || '/path/to/default/image.jpg'}
            alt={`${business.title} banner`}
            layout="fill" 
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={business.logo || '/path/to/default/logo.jpg'}
                alt={business.title} 
              />
              <AvatarFallback>{business.title.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{business.title}</h2>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {business.industry?.map((industry) => (
            <Badge key={industry} variant="secondary">
              {industry}
            </Badge>
          ))}
        </div>
        <p className="text-gray-700 mb-4">{business.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0 border-t">
        <Button variant="ghost" className="flex-1" onClick={handleLike}>
          <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current text-blue-500' : ''}`} />
        </Button>
        <Button variant="ghost" className="flex-1" onClick={handleMessage}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Message
        </Button>
        <Button variant="ghost" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}

