'use client'

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function ReactiveBackground({ className }: { className?: string }) {
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Default to dark theme during server-side rendering
  const isDark = !isClient || theme === 'dark'

  return (
    <>
      {/* Grid Pattern */}
      <div 
        className={cn(
          "absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]",
          className
        )}
      />

      {/* Base Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? 'from-background via-background/95 to-background/90'
            : 'from-background via-background/85 to-background/75'
        }`}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-left gradient orb */}
        <div 
          className={`absolute -top-1/2 -left-1/2 w-[150%] h-[150%] rounded-full blur-3xl animate-pulse ${
            isDark
              ? 'bg-gradient-to-br from-primary/20 to-transparent'
              : 'bg-gradient-to-br from-blue-500/50 via-blue-400/40 to-transparent'
          }`}
        />
        
        {/* Bottom-right gradient orb */}
        <div 
          className={`absolute -bottom-1/2 -right-1/2 w-[150%] h-[150%] rounded-full blur-3xl animate-pulse delay-1000 ${
            isDark
              ? 'bg-gradient-to-tl from-primary/20 to-transparent'
              : 'bg-gradient-to-tl from-blue-600/50 via-blue-500/40 to-transparent'
          }`}
        />

        {/* Additional light theme decorative elements */}
        {isClient && !isDark && (
          <>
            {/* Subtle moving particles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.5, 0.7, 0.5], 
                scale: [0.8, 1.2, 0.8],
                x: [-30, 30, -30],
                y: [-30, 30, -30]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/40 to-blue-500/30 rounded-full blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.5, 0.7, 0.5], 
                scale: [1.2, 0.8, 1.2],
                x: [30, -30, 30],
                y: [30, -30, 30]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/40 to-blue-600/30 rounded-full blur-2xl"
            />
          </>
        )}
      </div>

      {/* Subtle noise texture */}
      <div 
        className={`absolute inset-0 ${
          isDark 
            ? 'bg-noise-dark opacity-[0.03]' 
            : 'bg-noise-light opacity-[0.025]'
        } mix-blend-overlay`}
      />
    </>
  )
} 