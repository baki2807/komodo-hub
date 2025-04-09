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
      <ReactiveBackground className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
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
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]"
              >
                Uniting Hearts for Indonesia's Wildlife
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)] px-4 sm:px-0"
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
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
              {[
                {
                  icon: BookOpenIcon,
                  title: "Learn",
                  description: "Access comprehensive resources about Indonesia's wildlife and conservation practices.",
                  link: "/learn"
                },
                {
                  icon: UsersIcon,
                  title: "Connect",
                  description: "Join a community of passionate conservationists and share experiences.",
                  link: "/connect"
                },
                {
                  icon: HeartIcon,
                  title: "Contribute",
                  description: "Make a real impact through active participation in conservation projects.",
                  link: "/contribute"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="text-center bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 cursor-pointer group"
                >
                  <Link href={feature.link} className="block">
                    <motion.div 
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                      className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200"
                    >
                      <feature.icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-200" />
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-200"
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                    >
                      {feature.description}
                    </motion.p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 relative overflow-hidden bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                Our Impact
              </motion.h2>
              <motion.p 
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 group"
                >
                  <motion.div 
                    className="text-4xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors duration-200"
                  >
                    {item.number}
                  </motion.div>
                  <motion.div 
                    className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                  >
                    {item.text}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Hear from passionate members of our community who are making a difference.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Sarah Chen",
                  role: "Wildlife Photographer",
                  image: "/testimonials/sarah.jpg",
                  content: "Being part of Komodo Hub has opened my eyes to the incredible biodiversity of Indonesia. The community here is truly passionate about conservation."
                },
                {
                  name: "Dr. Ahmad Rizal",
                  role: "Marine Biologist",
                  image: "/testimonials/ahmad.jpg",
                  content: "The resources and connections I've made through this platform have been invaluable for my research on coral reef conservation."
                },
                {
                  name: "Lisa Williams",
                  role: "Conservation Volunteer",
                  image: "/testimonials/lisa.jpg",
                  content: "From learning about wildlife to actively participating in conservation projects, Komodo Hub has given me the platform to make a real difference."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl" />
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover rounded-full relative z-10 border-2 border-border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;
                        }}
                      />
                    </div>
                    <blockquote className="mb-4 text-muted-foreground">"{testimonial.content}"</blockquote>
                    <cite className="not-italic">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </cite>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Conservation Partners */}
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Our Conservation Partners</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Working together with leading organizations to protect Indonesia's wildlife and natural habitats.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
              {[
                { name: "WWF Indonesia", logo: "/partners/wwf.png" },
                { name: "IUCN", logo: "/partners/iucn.png" },
                { name: "Conservation International", logo: "/partners/ci.png" },
                { name: "Wildlife Conservation Society", logo: "/partners/wcs.png" },
                { name: "The Nature Conservancy", logo: "/partners/tnc.png" },
                { name: "Rainforest Alliance", logo: "/partners/ra.png" }
              ].map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square relative group"
                >
                  <div className="absolute inset-0 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="w-full h-full p-4 flex items-center justify-center">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`;
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto rounded-3xl overflow-hidden"
            >
              <div className="relative p-6 sm:p-10 md:p-16 bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl" />
                
                <div className="relative z-10 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Ready to Make a Difference?</h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                    Join our community of passionate conservationists and help protect Indonesia's precious wildlife for future generations.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Link href="/sign-up">
                      <Button size="lg" className="w-full sm:w-auto group">
                        Get Started
                        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
} 