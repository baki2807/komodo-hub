import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import React from 'react'
import { env } from '@/lib/env'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Komodo Hub',
  description: 'A community-driven platform for animal conservation in Indonesia',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <ThemeProvider>
            <div suppressHydrationWarning>
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
} 