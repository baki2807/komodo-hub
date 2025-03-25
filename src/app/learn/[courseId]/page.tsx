'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Link from 'next/link'
import { CheckCircle, ChevronRight, Clock, ArrowLeft, BookOpen } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { HydrationWrapper } from '@/components/ui/hydration-wrapper'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'

interface Module {
  _id: string
  title: string
  content: string
  estimatedTime: number
}

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  level: string
  modules: Module[]
}

interface UserProgress {
  userId: string
  courseId: string
  completedModules: string[]
  lastAccessed: string
}

function CourseContent({ params }: { params: { courseId: string } }) {
  const { user, isLoaded } = useUser()
  const [course, setCourse] = useState<Course | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}`)
      if (!response.ok) throw new Error('Failed to fetch course')
      const data = await response.json()
      setCourse(data)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course')
    }
  }, [params.courseId])

  const fetchUserProgress = useCallback(async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/user-progress?courseId=${params.courseId}`)
      if (!response.ok) throw new Error('Failed to fetch progress')
      const data = await response.json()
      setUserProgress(data)
    } catch (error) {
      console.error('Error fetching progress:', error)
      toast.error('Failed to load progress')
    } finally {
      setIsLoading(false)
    }
  }, [user, params.courseId])

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        toast.error('Please sign in to access course content')
        return
      }
      Promise.all([fetchCourse(), fetchUserProgress()])
    }
  }, [isLoaded, user, params.courseId, fetchCourse, fetchUserProgress])

  const isModuleCompleted = (moduleId: string) => {
    return userProgress?.completedModules?.includes(moduleId) || false
  }

  const calculateProgress = () => {
    if (!course || !userProgress?.completedModules) return 0
    return (userProgress.completedModules.length / course.modules.length) * 100
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={`loading-skeleton-${i}`} className="h-24 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isLoading && !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/learn" 
            className="text-primary hover:underline"
          >
            Return to Learning Hub
          </Link>
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
      >
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" />
          <span>Back to Learning Hub</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-3">{course?.title || 'Course'}</h1>
          <p className="text-lg text-muted-foreground mb-6">{course?.description || 'No description available'}</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {course?.level || 'All Levels'}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{course?.modules?.length || 0} modules</span>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border rounded-lg p-5 shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Course Progress</div>
              <div className="text-sm text-muted-foreground">
                {Math.round(calculateProgress())}%
              </div>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4">Modules</h2>
        {course?.modules?.map((module, index) => (
          <motion.div
            key={module._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
            whileHover={{ scale: 1.01 }}
          >
            <Link
              href={`/learn/${course?._id || params.courseId}/${module._id}`}
              className="group block bg-card border shadow-sm rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-primary/80 font-medium">
                      Module {index + 1}
                    </span>
                    {isModuleCompleted(module._id) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{module.estimatedTime} min</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  return (
    <PageLayout>
      <HydrationWrapper>
        <CourseContent params={params} />
      </HydrationWrapper>
    </PageLayout>
  )
} 