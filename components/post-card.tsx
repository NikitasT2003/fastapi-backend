import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react'
import { Post } from "@/store"
import { formatDistanceToNow } from 'date-fns'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src={post.avatar} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{post.author}</h4>
                <p className="text-sm">@{post.author}</p>
                <div className="flex items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDistanceToNow(new Date(2021, 0, 1))} ago
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-sm text-gray-500">@{post.author}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2">{post.content}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(post.created_at))} ago</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button variant="ghost" size="sm" onClick={() => onComment(post.post_id)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onLike(post.post_id)}>
          <Heart className="mr-2 h-4 w-4" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onShare(post.post_id)}>
          <Share2 className="mr-2 h-4 w-4" />
          {post.shares}
        </Button>
      </CardFooter>
    </Card>
  )
}

