import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home,User, Heart, Settings, LogOut, Inbox } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useStore } from '@/store';
import { useState } from 'react';
import { Users } from '@/store';

interface LeftSidebarProps {
  user: Users ;
}

export function LeftSidebar({ user }: LeftSidebarProps) {
  const { fetchCurrentUser } = useStore();
  const [currentUser, setCurrentUser] = useState< any >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUserData = async () => {
    const user = await fetchCurrentUser(); // Await the promise
    if (user) {
      setCurrentUser(user);
    }
  };
  return (
    <div className="w-64 h-screen p-4 border-r sticky top-0">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center space-x-2 mb-6 cursor-pointer">
            <Avatar>
              <AvatarImage src={user?.profile_picture} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">@{user?.username}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={user?.profile_picture} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{user?.username}</h4>
              <p className="text-sm text-muted-foreground">
                {user?.description || "No description provided."}
              </p>
              <div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown date"}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <nav className="space-y-2">
        <Link href="/browse" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/inbox" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Inbox className="mr-2 h-4 w-4" />
            Inbox
          </Button>
        </Link>
        <Link href="/profile" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Link href="/favorites" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </Button>
        </Link>
        <Link href="/settings" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>
      <div className="mt-auto pt-6">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}

