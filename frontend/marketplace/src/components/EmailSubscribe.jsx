import { useState } from 'react'
import { Button } from "@shadcn/ui/button"
import { Input } from "@shadcn/ui/input"

export default function EmailSubscribe() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the email to your backend or newsletter service
    console.log('Subscribing email:', email)
    // Reset the form
    setEmail('')
    // You might want to show a success message to the user here
  }

  return (
    <div className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Subscribe to Our Newsletter</h2>
        <p className="text-center mb-6">Stay updated with the latest business opportunities and market trends.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </div>
  )
}

