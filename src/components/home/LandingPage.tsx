'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { ReactiveBackground } from '@/components/ui/ReactiveBackground'
import { ArrowRightIcon, BookOpenIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline'

export function LandingPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <div className="animate-pulse">
          <div className="h-[90vh] bg-muted/20" />
          <div className="h-32 bg-muted/20" />
          <div className="h-32 bg-muted/20" />
          <div className="h-32 bg-muted/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <ReactiveBackground />
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <motion.span 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center p-2 bg-black/30 backdrop-blur-sm rounded-full"
              >
                <span className="px-3 py-1 text-sm font-medium text-white bg-white/10 rounded-full">
                  Welcome to Komodo Hub 🦎
                </span>
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Uniting Hearts for Indonesia's Wildlife
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Where passion meets purpose in preserving our natural heritage. Join our community of dedicated conservationists working to protect Indonesia's unique biodiversity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto group bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20">
                    Join the Movement
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 relative overflow-hidden">
        <ReactiveBackground />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 cursor-pointer group"
            >
              <Link href="/learn" className="block">
                <motion.div 
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200"
                >
                  <BookOpenIcon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-200" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  Learn
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 mb-6"
                  whileHover={{ scale: 1.01 }}
                >
                  Access comprehensive resources about Indonesia's wildlife and conservation practices.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button variant="outline" className="group-hover:bg-primary/10">
                    Start Learning
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 cursor-pointer group"
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200"
              >
                <UsersIcon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-200" />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                Connect
              </motion.h3>
              <motion.p 
                className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                whileHover={{ scale: 1.01 }}
              >
                Join a community of passionate conservationists and share experiences.
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 cursor-pointer group"
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200"
              >
                <HeartIcon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-200" />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                Contribute
              </motion.h3>
              <motion.p 
                className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                whileHover={{ scale: 1.01 }}
              >
                Make a real impact through active participation in conservation projects.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <ReactiveBackground />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              Our Impact
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Together, we're making significant strides in wildlife conservation across Indonesia
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50+", text: "Protected Species" },
              { number: "1000+", text: "Active Members" },
              { number: "100+", text: "Projects" },
              { number: "25+", text: "Partners" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 cursor-pointer group"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="text-4xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                >
                  {item.number}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.text}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <ReactiveBackground />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 text-white drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/90 mb-8 drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Join our community today and be part of Indonesia's wildlife conservation movement.
            </motion.p>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto group bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20 transition-all duration-200">
                  Get Started
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 