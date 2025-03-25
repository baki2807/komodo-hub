'use client'

import { Navbar } from "@/components/Navbar"
import { ReactiveBackground } from "@/components/ui/ReactiveBackground"
import { motion } from "framer-motion"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <ReactiveBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`container relative mx-auto px-4 py-8 ${className}`}
      >
        {children}
      </motion.div>
    </main>
  )
} 