'use client'

import { SignUp } from "@clerk/nextjs"
import { Navbar } from "@/components/Navbar"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function SignUpPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Define the appearance object outside the render
  const appearance = {
    baseTheme: isDark ? dark : undefined,
    variables: {
      colorBackground: isDark ? "#020817" : "#ffffff",
      colorInputBackground: isDark ? "#020817" : "#ffffff",
      colorAlphaShade: isDark ? "#1e293b" : "#e2e8f0",
      colorText: isDark ? "#ffffff" : "#000000",
      colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
      colorPrimary: "#3b82f6",
      colorDanger: "#ef4444",
      colorSuccess: "#22c55e",
      borderRadius: "0.75rem"
    },
    elements: {
      rootBox: "mx-auto w-full max-w-[480px]",
      card: {
        backgroundColor: isDark ? "#020817" : "#ffffff",
        border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
        boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(16px)",
        borderRadius: "1rem"
      },
      headerTitle: "text-2xl font-bold text-foreground mb-2",
      headerSubtitle: "text-muted-foreground text-base",
      socialButtonsBlockButton: {
        backgroundColor: isDark ? "#020817" : "#ffffff",
        border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
      },
      socialButtonsBlockButtonText: {
        color: isDark ? "#ffffff" : "#000000",
        fontSize: "0.9375rem"
      },
      dividerLine: {
        backgroundColor: isDark ? "#1e293b" : "#e2e8f0"
      },
      dividerText: {
        color: isDark ? "#94a3b8" : "#64748b"
      },
      formFieldLabel: "text-foreground font-medium mb-1.5",
      formFieldInput: {
        backgroundColor: isDark ? "#020817" : "#ffffff",
        borderColor: isDark ? "#1e293b" : "#e2e8f0",
        color: isDark ? "#ffffff" : "#000000",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
      },
      formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl p-3 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
      footerActionLink: "text-primary hover:text-primary/80 font-medium transition-colors",
      footerActionText: {
        color: isDark ? "#94a3b8" : "#64748b"
      },
    },
    layout: {
      socialButtonsPlacement: "bottom" as const,
      privacyPageUrl: "/privacy",
      termsPageUrl: "/terms",
    },
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[480px]"
        >
          {!isClient ? (
            // Loading state while client-side hydration occurs
            <div className="bg-card/80 shadow-2xl border rounded-2xl p-8 backdrop-blur-xl w-full max-w-[480px] mx-auto animate-pulse">
              <div className="h-8 w-1/2 mx-auto bg-muted rounded mb-4"></div>
              <div className="h-4 w-3/4 mx-auto bg-muted rounded mb-8"></div>
              <div className="h-12 w-full bg-muted rounded mb-4"></div>
              <div className="h-4 w-1/4 mx-auto bg-muted rounded my-6"></div>
              <div className="h-12 w-full bg-muted rounded mb-4"></div>
              <div className="h-12 w-full bg-muted rounded mb-4"></div>
              <div className="h-12 w-full bg-muted rounded"></div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SignUp 
                appearance={appearance}
                redirectUrl="/"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
} 