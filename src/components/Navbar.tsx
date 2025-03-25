'use client'

import Link from 'next/link'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { isSignedIn } = useUser()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-[#1D2B3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="font-semibold text-lg text-primary hover:text-primary/80 transition-colors">
                Komodo Hub
              </span>
            </Link>
            
            <div className="flex items-center gap-6" suppressHydrationWarning>
              {!isClient ? (
                // Skeleton loading state
                <>
                  <div className="h-6 w-16 bg-muted/20 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-muted/20 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <Link 
                    href="/about" 
                    className="text-sm text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    About
                  </Link>
                  {isSignedIn && (
                    <>
                      <Link 
                        href="/learn" 
                        className="text-sm text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Learn
                      </Link>
                      <Link 
                        href="/community" 
                        className="text-sm text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Community
                      </Link>
                      <Link 
                        href="/chat" 
                        className="text-sm text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Chat
                      </Link>
                      <Link 
                        href="/profile" 
                        className="text-sm text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <ThemeToggle />
                  {isSignedIn ? (
                    <SignOutButton signOutCallback={() => router.push('/')}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white font-normal px-3"
                      >
                        Sign Out
                      </Button>
                    </SignOutButton>
                  ) : (
                    <SignInButton>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white font-normal px-3"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-14" /> {/* Spacer to prevent content from going under navbar */}
    </>
  )
} 