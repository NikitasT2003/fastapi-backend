'use client'

import { useStore } from "@/store"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Header } from "@/components/ui/Header"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  const { registerUser } = useStore()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const userData = {
      name: formData.get('name') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      profile_picture: formData.get('profile_picture') as string | undefined,
      description: formData.get('description') as string | undefined,
      is_seller: formData.get('is_seller') === 'on',
    }

    try {
      await registerUser(
        userData.name,
        userData.username,
        userData.email,
        userData.password,
        userData.is_seller,
        userData.profile_picture,
        userData.description
      )
      router.push('/login')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <SignupForm className="w-full max-w-md" onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 