'use client'

import Link from 'next/link'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const { isSignedIn } = useUser()
  const [isClient, setIsClient] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-6" suppressHydrationWarning>
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
        
        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-[#1D2B3F]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1D2B3F] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {isSignedIn && (
                <>
                  <Link 
                    href="/learn" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1D2B3F] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Learn
                  </Link>
                  <Link 
                    href="/community" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1D2B3F] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Community
                  </Link>
                  <Link 
                    href="/chat" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1D2B3F] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1D2B3F] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-[#1D2B3F]">
              <div className="flex items-center justify-between px-3">
                <ThemeToggle />
                {isSignedIn ? (
                  <SignOutButton signOutCallback={() => {
                    setIsMenuOpen(false)
                    router.push('/')
                  }}>
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
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-14" /> {/* Spacer to prevent content from going under navbar */}
    </>
  )
} 