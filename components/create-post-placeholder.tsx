import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'

interface CreatePostPlaceholderProps {
  user: {
    name: string;
    avatar: string;
  };
  onCreatePost: () => void;
  onCreateListing: () => void;
}

export function CreatePostPlaceholder({ user, onCreatePost, onCreateListing }: CreatePostPlaceholderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input 
            className="flex-1" 
            placeholder="Share your business idea or create a listing..." 
            onClick={onCreatePost}
          />
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onCreatePost}>
            Create Post
          </Button>
          <Button variant="outline" onClick={onCreateListing}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

