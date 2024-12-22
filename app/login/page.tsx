'use client'

import { LoginForm } from "@/components/login-form"
import { Header } from "@/components/ui/Header"

export default function LoginPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
