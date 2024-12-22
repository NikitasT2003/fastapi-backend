'use client'

import { useState } from 'react'
import { User, Bell } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'


export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This should be replaced with actual auth state

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/placeholder-logo.svg"
            alt="BusinessMarket"
            width={150}
            height={40}
            priority
          />
        </Link>
        <ul className="flex items-center space-x-6">
          <li>
            <Link href="/browse" className="text-gray-600 hover:text-gray-800">
              Browse
            </Link>
          </li>
          <li>
            <Link href="/sell" className="text-gray-600 hover:text-gray-800">
              Sell
            </Link>
          </li>
          <li className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="User menu"
              >
                <User className="h-6 w-6" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {isLoggedIn ? (
                    <>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Account Settings
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Edit Profile
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          {/* Add your profile editing form or content here */}
                          <h2 className="text-lg font-semibold">Edit Profile</h2>
                          {/* Example form fields */}
                          <form>
                            <label className="block text-sm font-medium text-gray-700">
                              Name
                              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mt-4">
                              Email
                              <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </label>
                            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                              Save Changes
                            </button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <button
                        onClick={() => {
                          // Implement logout functionality
                          setIsLoggedIn(false)
                          setIsDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Signup / Login
                    </Link>
                  )}
                </div>
              )}
            </div>
            <button
              className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

