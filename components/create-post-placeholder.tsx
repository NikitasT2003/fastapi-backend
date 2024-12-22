import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'
import { Post } from '@/store';
import { Business } from '@/store';
import { useStore } from '@/store';

interface CreatePostPlaceholderProps {
  user?: {
    name: string;
    avatar: string;
    user_id: number;
  } | null;
  onCreatePost: (postData: Post) => void;
  onCreateListing: (listingData: Business) => void;
}

export function CreatePostPlaceholder({ user , onCreatePost, onCreateListing }: CreatePostPlaceholderProps) {
  const handlePostClick = () => {
    const postData: Post = {
      post_id: Date.now().toString(),
      content: "Your post content here",
      created_at: new Date().toISOString(),
      author: user ? user.name : "Guest",
      avatar: user ? user.avatar : "",
      image: "",
      comments: 0,
      likes: 0,
      shares: 0,
    };
    onCreatePost(postData);
  };

  const handleListingClick = () => {
    const listingData: Business = {
      title: "Your listing title here",
      description: "Your listing description here",
      price: 100,
      created_at: new Date(),
      seller_id: user ? user.user_id : 0,
    };
    onCreateListing(listingData);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input 
            className="flex-1" 
            placeholder="Share your business idea or create a listing..." 
            onClick={handlePostClick}
          />
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePostClick}>
            Create Post
          </Button>
          <Button variant="outline" onClick={handleListingClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

