'use client'

import { useEffect, useState } from 'react'

interface HydrationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  suppressHydrationWarning?: boolean
}

export function HydrationWrapper({ 
  children, 
  fallback,
  className = '',
  suppressHydrationWarning = false
}: HydrationWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback || (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-muted/20 rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted/20 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted/20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </div>
  )
} 