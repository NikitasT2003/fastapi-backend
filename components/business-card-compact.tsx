import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Business } from "@/types/business"
import { CheckCircle } from 'lucide-react'

interface BusinessCardCompactProps {
  business: Business;
  onClick: (id: string) => void;
}

export function BusinessCardCompact({ business, onClick }: BusinessCardCompactProps) {
  return (
    <Card className="w-full cursor-pointer hover:bg-gray-50" onClick={() => onClick(business.id)}>
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={business.logo} alt={business.name} />
          <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold">{business.name}</h3>
            {business.isVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
          </div>
          <p className="text-xs text-gray-500">Est. ${business.evaluationEstimate.toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {business.industries.map((industry) => (
            <Badge key={industry} variant="secondary" className="text-xs">
              {industry}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

