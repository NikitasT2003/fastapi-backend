import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, BookmarkCheck, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BusinessCard({
  name,
  description,
  industry,
  isVerified,
  logoUrl,
  bannerUrls,
  likes,
  saves
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerUrls.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerUrls.length) % bannerUrls.length)
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-0">
        <div className="relative h-48">
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={bannerUrls[0]}
                alt={`${name} banner`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{name} Images</DialogTitle>
                <DialogDescription>Browse through {name}'s image gallery</DialogDescription>
              </DialogHeader>
              <div className="relative h-64 mt-4">
                <Image
                  src={bannerUrls[currentSlide]}
                  alt={`${name} banner ${currentSlide + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="absolute -bottom-6 left-4">
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              width={64}
              height={64}
              className="rounded-full border-4 border-white"
            />
          </div>
        </div>
        <div className="p-4 pt-8">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex gap-2">
              <Badge variant="secondary">{industry}</Badge>
              {isVerified && (
                <Badge variant="default" className="bg-blue-500">
                  Verified
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className="h-4 w-4" />
          <span>{isLiked ? likes + 1 : likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${isSaved ? 'text-yellow-500' : ''}`}
          onClick={() => setIsSaved(!isSaved)}
        >
          <BookmarkCheck className="h-4 w-4" />
          <span>{isSaved ? saves + 1 : saves}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>Message</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

