import Link from 'next/link'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-center mb-8">Oops! The page you're looking for doesn't exist.</p>
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            It seems you've ventured into uncharted territory. Don't worry, even the best entrepreneurs take a wrong turn sometimes!
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/">
                Return to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

