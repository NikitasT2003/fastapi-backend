'use client'

import { useState } from 'react'
import { User, Bell } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
                  <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Up
                  </Link>
                  <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Login
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Account Settings
                      </Link>
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

