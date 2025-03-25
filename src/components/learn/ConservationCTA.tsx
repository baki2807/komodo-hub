'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const ConservationCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 rounded-2xl border border-primary/20"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          Join the Conservation Movement
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Learning is just the first step. Connect with other conservation enthusiasts, 
          share knowledge, and find opportunities to contribute to Indonesian wildlife 
          conservation projects.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/community">
            <Button size="lg" className="min-w-[180px]">
              Join Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link href="/chat">
            <Button size="lg" variant="outline" className="min-w-[180px]">
              Chat with Members
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
} 