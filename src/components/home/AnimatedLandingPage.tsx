'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AnimatedLandingPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render animations until after hydration
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-accent/10 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-accent/10 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-accent/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[75vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block animate-bounce"
            >
              <span className="inline-flex items-center justify-center p-2 bg-black/30 backdrop-blur-sm rounded-full">
                <span className="px-3 py-1 text-sm font-medium text-white bg-white/10 rounded-full">
                  Join Our Mission 🌿
                </span>
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Uniting Hearts for Indonesia's Wildlife
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white mb-8 leading-relaxed drop-shadow-md max-w-xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
            >
              Join our thriving community of passionate conservationists.
              Together, we can protect Indonesia's unique and endangered species.
              Be part of a movement that ensures a sustainable future for our precious ecosystems.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-black/30 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-black/30 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm shadow-lg">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 bg-background border-y"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-card rounded-xl p-6 border border-border/50 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Species Protected</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-card rounded-xl p-6 border border-border/50 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-card rounded-xl p-6 border border-border/50 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Conservation Projects</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-card rounded-xl p-6 border border-border/50 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Partner Organizations</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                Why Join Komodo Hub?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Our platform provides everything you need to make a meaningful impact in wildlife conservation
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Engagement</h3>
                <p className="text-muted-foreground">
                  Connect with passionate conservationists, share experiences, and learn from experts in the field. Build lasting relationships with like-minded individuals.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Knowledge Sharing</h3>
                <p className="text-muted-foreground">
                  Access comprehensive educational resources, research papers, and stay updated with the latest conservation practices and methodologies.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Real Impact</h3>
                <p className="text-muted-foreground">
                  Contribute directly to conservation efforts, track your impact over time, and see the tangible results of your involvement in protecting wildlife.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Species Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-primary/5"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                Featured Species
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Learn about the incredible species we're working to protect
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-sm"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/komodo.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2">Komodo Dragon</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    The largest living species of lizard, found only in Indonesia
                  </p>
                  <div className="flex items-center text-sm mt-auto">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium">
                      Endangered
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-sm"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/orangutan.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2">Orangutan</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    Asia's only great ape, critically endangered in Borneo and Sumatra
                  </p>
                  <div className="flex items-center text-sm mt-auto">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium">
                      Critically Endangered
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-sm"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/rhino.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2">Javan Rhino</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    One of the rarest large mammals on Earth with fewer than 80 individuals remaining
                  </p>
                  <div className="flex items-center text-sm mt-auto">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium">
                      Critically Endangered
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                What Our Members Say
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Hear from our community of dedicated conservationists
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl p-8 border backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">DS</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Dr. Sarah</h4>
                    <p className="text-sm text-muted-foreground">Wildlife Biologist</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The platform has revolutionized how we collaborate on conservation projects. The community's expertise and dedication are truly inspiring."
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl p-8 border backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">JR</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">John R.</h4>
                    <p className="text-sm text-muted-foreground">Conservation Volunteer</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Being part of this community has given me the opportunity to contribute meaningfully to wildlife conservation. The resources and support are invaluable."
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl p-8 border backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">MA</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Maria A.</h4>
                    <p className="text-sm text-muted-foreground">Research Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The knowledge sharing and mentorship I've received here have been instrumental in my research on endangered species conservation."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-8"
            >
              Join our community today and be part of Indonesia's wildlife conservation movement
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-lg">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  )
} 