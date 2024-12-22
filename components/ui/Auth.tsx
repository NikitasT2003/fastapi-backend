'use client'

import { useState } from 'react'
import { useRouter } from 'next/compat/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store'
import { signIn } from 'next-auth/react'
import { EyeOff, Eye } from 'react-feather';

export function Auth() {
  const router = useRouter();
  const { registerUser, loginUser } = useStore();
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false);
  
  const toggleAuthMode = () => setIsLogin(!isLogin)

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginUser(username, password);
      alert('Login successful');
      if (router) { router.push('/browse'); }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSignup = async () => {
    setLoading(true);
    try {
      const payload = { 
        name, 
        username, 
        email, 
        password, 
        is_seller: isSeller, 
        is_admin: false
      }
      await registerUser(payload);
      alert('Signup successful');
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
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
      <Card className="w-full max-w-md flex">
        <div className="w-1/2 flex flex-col">
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
              <Button type="submit" className="w-full mb-4" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
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
        </div>
        <div className="w-1/2">
          <img src="/path/to/your/image.jpg" alt="Auth Image" className="w-full h-full object-cover" />
        </div>
      </Card>
    </div>
  )
}