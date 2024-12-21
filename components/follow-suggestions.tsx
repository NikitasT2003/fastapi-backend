import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export type Suggestion = {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface FollowSuggestionsProps {
  suggestions: Suggestion[] | null;
  onFollow: (id: string) => void;
}

export function FollowSuggestions({ suggestions, onFollow }: FollowSuggestionsProps) {
  if (!suggestions) {
    return <p>No suggestions available.</p>;
  }

  const limitedSuggestions = suggestions.slice(0, 5);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Who to follow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {limitedSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{suggestion.name}</p>
                <p className="text-sm text-gray-500">@{suggestion.username}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onFollow(suggestion.id)}>
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

