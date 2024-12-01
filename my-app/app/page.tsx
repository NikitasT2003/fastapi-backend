import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { EmailSubscribe } from '@/components/ui/EmailSubscribe'

export default function Businesses() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <h1 className="text-4xl font-bold text-center my-8">Welcome to BusinessMarket</h1>
        <p className="text-center text-xl mb-8">Your platform for buying and selling businesses</p>
        {/* Add more content here */}
      </main>
      <EmailSubscribe />
      <Footer />
    </div>
  )
}
