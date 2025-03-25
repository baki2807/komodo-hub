'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Link from 'next/link'
import { ChevronRight, BookOpen } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { HydrationWrapper } from '@/components/ui/hydration-wrapper'
import { motion } from 'framer-motion'

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  level: string
  modules: {
    _id: string
    title: string
    content: string
  }[]
}

function LearnContent() {
  const { user, isLoaded } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        toast.error('Please sign in to access learning content')
        return
      }
      fetchCourses()
    }
  }, [isLoaded, user])

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={`loading-skeleton-${i}`} className="h-64 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold"
        >
          Learning <span className="text-primary">Hub</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground text-lg mb-8"
        >
          Explore our courses and start your learning journey
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index + 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-card border shadow-sm rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
          >
            <Link 
              href={`/learn/${course._id}`}
              className="group block h-full"
            >
              <div className="aspect-video relative">
                <img 
                  src={course.thumbnail || '/images/courses/default-course.jpg'} 
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full w-fit">
                    {course.level}
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.modules.length} modules</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function LearnPage() {
  return (
    <PageLayout>
      <HydrationWrapper>
        <LearnContent />
      </HydrationWrapper>
    </PageLayout>
  )
} 