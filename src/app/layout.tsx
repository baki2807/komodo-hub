import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

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
        <ClerkProvider>
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