import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EmailSubscribe } from '@/components/EmailSubscribe'
import { BusinessCard } from '@/components/BusinessCard'

const exampleBusinesses = [
  {
    name: "TechInnovate Solutions",
    description: "Cutting-edge software development and IT consulting services.",
    industry: "Technology",
    isVerified: true,
    logoUrl: "/placeholder.svg?height=64&width=64",
    bannerUrls: [
      "/placeholder.svg?height=300&width=400&text=TechInnovate+1",
      "/placeholder.svg?height=300&width=400&text=TechInnovate+2",
      "/placeholder.svg?height=300&width=400&text=TechInnovate+3",
    ],
    likes: 150,
    saves: 75,
  },
  {
    name: "GreenLeaf Organics",
    description: "Sustainable and organic food products for health-conscious consumers.",
    industry: "Food & Beverage",
    isVerified: false,
    logoUrl: "/placeholder.svg?height=64&width=64",
    bannerUrls: [
      "/placeholder.svg?height=300&width=400&text=GreenLeaf+1",
      "/placeholder.svg?height=300&width=400&text=GreenLeaf+2",
      "/placeholder.svg?height=300&width=400&text=GreenLeaf+3",
    ],
    likes: 89,
    saves: 42,
  },
  {
    name: "FitnessFusion Gym",
    description: "State-of-the-art fitness center offering personalized training programs.",
    industry: "Health & Fitness",
    isVerified: true,
    logoUrl: "/placeholder.svg?height=64&width=64",
    bannerUrls: [
      "/placeholder.svg?height=300&width=400&text=FitnessFusion+1",
      "/placeholder.svg?height=300&width=400&text=FitnessFusion+2",
      "/placeholder.svg?height=300&width=400&text=FitnessFusion+3",
    ],
    likes: 210,
    saves: 95,
  },
]

export default function BusinessListings() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center my-8">Business Listings</h1>
        <p className="text-center text-xl mb-8">Explore our curated selection of businesses for sale</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleBusinesses.map((business, index) => (
            <BusinessCard key={index} {...business} />
          ))}
        </div>
      </main>
      <EmailSubscribe />
      <Footer />
    </div>
  )
}

