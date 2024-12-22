'use client'

import { SignupForm } from "@/components/signup-form"
import { Header } from "@/components/ui/Header"
import { useStore } from "@/store"

export default function SignupPage() {
  const { registerUser } = useStore()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const userData = Object.fromEntries(formData.entries())
    registerUser(userData as any)
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