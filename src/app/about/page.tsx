'use client'

import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Users, Leaf, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { ReactiveBackground } from '@/components/ui/ReactiveBackground'

export default function AboutPage() {
  const { user } = useUser()

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[75vh] flex items-center">
        {/* Background Effects */}
        <ReactiveBackground />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Content */}
        <div className="container relative mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block animate-bounce"
            >
              <span className="inline-flex items-center justify-center p-2 bg-black/30 backdrop-blur-sm rounded-full">
                <span className="px-3 py-1 text-sm font-medium text-white bg-white/10 rounded-full">
                  Our Goal 🌿
                </span>
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Preserving Indonesia's Natural Legacy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white mb-8 leading-relaxed drop-shadow-md max-w-2xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Where passion meets purpose in preserving our natural heritage.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-10 bg-background relative overflow-hidden">
        <ReactiveBackground />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border/50 backdrop-blur-sm"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Our Vision
              </h2>
              <p className="text-xl text-card-foreground leading-relaxed">
                Komodo Hub is more than just a platform—it's a digital sanctuary where conservation meets community.
                We're building a vibrant ecosystem where every voice, every action, and every observation contributes
                to the preservation of Indonesia's magnificent wildlife.
              </p>
            </motion.div>

            {/* Community Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                A Living Community
              </h2>
              <p className="text-lg text-card-foreground leading-relaxed mb-6">
                Imagine a place where a student's wildlife photograph can spark a nationwide conservation effort. 
                Where local wisdom meets scientific research. Where every member—from seasoned researchers to 
                passionate citizens—plays a crucial role in protecting our endangered species.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-card-foreground">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-muted/50 rounded-xl p-6 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2">Schools & Education</h3>
                  <p>Empowering the next generation through hands-on conservation projects and real-world learning.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-muted/50 rounded-xl p-6 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2">Local Communities</h3>
                  <p>Bridging traditional knowledge with modern conservation practices for sustainable impact.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-muted/50 rounded-xl p-6 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2">Citizen Scientists</h3>
                  <p>Transforming passion into action through wildlife monitoring and data collection.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Focus Species */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Guardians of the Extraordinary
              </h2>
              <p className="text-lg text-card-foreground leading-relaxed mb-6">
                Our focus extends to some of Indonesia's most remarkable yet vulnerable species:
              </p>
              <div className="space-y-4 text-card-foreground">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-muted/50 rounded-xl p-6 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2">Javan Rhinoceros</h3>
                  <p>One of the rarest large mammals on Earth, with fewer than 75 individuals remaining in the wild.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-muted/50 rounded-xl p-6 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2">Sumatran Tiger</h3>
                  <p>The last of Indonesia's tigers, masters of the rainforest fighting for survival.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-muted/50 rounded-xl p-6 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2">Bali Myna</h3>
                  <p>A living jewel of Indonesian avifauna, brought back from the brink through community efforts.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Call to Action - Only show when not signed in */}
            {!user && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center py-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-foreground">Join Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Every voice matters in the symphony of conservation. Add yours to our growing community.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/sign-up" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
                    Become a Guardian
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
} 