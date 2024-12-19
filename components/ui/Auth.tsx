'use client'

import { useState } from 'react'
import { useRouter } from 'next/compat/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/utils/api'
import { signIn } from 'next-auth/react'
import { EyeOff, Eye } from 'react-feather';

export function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('')
  
  const toggleAuthMode = () => setIsLogin(!isLogin)

  const handleLogin = async () => {
    try {
      const payload = {
        grant_type: 'password',   // Required grant type
        username,                 // Username input
        password,                 // Password input
        scope: '',                // Optional, leave empty if not required
        client_id: '',            // Optional, leave empty if not required
        client_secret: '',        // Optional, leave empty if not required
      };
  
      // Send the login request as 'application/x-www-form-urlencoded'
      const data = await apiRequest('/api/login', 'POST', payload, 'form');
  
      alert('Login successful');
      if (router) { router.push('/home'); } // Redirect after successful login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  const handleSignup = async () => {
    try {
      const payload = { name,username, email, password, is_seller: isSeller }
      const data = await apiRequest('/api/signup', 'POST', payload)
      alert('Signup successful')
      if (router) { router.push('/auth'); } // Redirect after successful signup
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
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
            {!isLogin && (
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
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
            <div className="mb-4 relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
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