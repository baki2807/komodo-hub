'use client'

import { useUser } from '@clerk/nextjs'
import { LandingPage } from '@/components/home/LandingPage'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || isSignedIn) {
    return null // Return null while loading or redirecting
  }

  return <LandingPage />
} 