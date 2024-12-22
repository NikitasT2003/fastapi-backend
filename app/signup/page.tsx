'use client'

import { SignupForm } from "@/components/signup-form"
import { Header } from "@/components/ui/Header"
import { useStore } from "@/store"

export default function SignupPage() {
  const { registerUser } = useStore()


  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <SignupForm className="w-full max-w-md" onSubmit={handleSignup} />
      </div>
    </div>
  )
} 