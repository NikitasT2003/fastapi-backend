'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/utils/api'
import { signIn } from 'next-auth/react'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleAuthMode = () => setIsLogin(!isLogin)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const endpoint = isLogin ? '/auth/token' : '/auth/signup'
      const payload = isLogin
        ? { username, password }
        : { username, email, password, is_seller: isSeller }
      const data = await apiRequest(endpoint, 'POST', payload)
      alert(data.message || 'Success')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
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
            )}
            <Button type="submit" className="w-full mb-4">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
          <Button variant="link" onClick={toggleAuthMode} className="w-full mb-4">
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </Button>
          <Button onClick={() => signIn('google')} className="w-full mb-2">
            Sign in with Google
          </Button>
          <Button onClick={() => signIn('facebook')} className="w-full">
            Sign in with Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 