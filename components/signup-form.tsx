"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/store"
import { AlertTitle , AlertDescription} from "@/components/ui/alert"
import { apiRequest } from "@/utils/api"

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { registerUser } = useStore()
  
  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name,
        username,
        email,
        password,
        is_seller: isSeller,
      }
      await apiRequest('/signup', 'POST', payload)
      alert('Signup successful')
      router.push('/login')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSignup} className={className} {...props}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-center">Create an account</h1>
          <p className="text-center text-gray-600">Enter your information to create an account</p>
        </div>
        <div className="mb-4">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
              className="mr-2"
            />
            <span>Register as a seller</span>
          </label>
        </div>
        <Button type="submit" className="w-full mb-4" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </form>
    </>
  )
} 