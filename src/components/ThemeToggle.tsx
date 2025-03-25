'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center rounded-md p-1.5"
        aria-label="Loading theme toggle"
      >
        <div className="h-5 w-5 bg-muted/20 rounded animate-pulse" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center justify-center rounded-md p-1.5"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
      )}
    </button>
  )
} 