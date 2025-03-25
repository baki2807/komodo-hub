'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { HydrationWrapper } from '@/components/ui/hydration-wrapper'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/ui/markdown'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Module {
  _id: string
  title: string
  content: string
  estimatedTime: number
}

interface Course {
  _id: string
  title: string
  modules: Module[]
}

interface UserProgress {
  userId: string
  courseId: string
  completedModules: string[]
  lastAccessed: string
}

function ModuleContent({ params }: { params: { courseId: string; moduleId: string } }) {
  const { user, isLoaded } = useUser()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}`)
      if (!response.ok) throw new Error('Failed to fetch course')
      const data = await response.json()
      setCourse(data)
      setCurrentModule(data.modules.find((m: Module) => m._id === params.moduleId) || null)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course')
    }
  }, [params.courseId, params.moduleId])

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
        toast.error('Please sign in to access module content')
        return
      }
      Promise.all([fetchCourse(), fetchUserProgress()])
    }
  }, [isLoaded, user, fetchCourse, fetchUserProgress])

  const handleCompleteModule = async () => {
    if (!user || !course || !currentModule || isCompleting) return
    setIsCompleting(true)

    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course._id,
          moduleId: currentModule._id,
        }),
      })

      if (!response.ok) throw new Error('Failed to update progress')
      
      const updatedProgress = await response.json()
      setUserProgress(updatedProgress)
      toast.success('Module completed!')
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to mark module as complete')
    } finally {
      setIsCompleting(false)
    }
  }

  const isModuleCompleted = (moduleId: string) => {
    return userProgress?.completedModules?.includes(moduleId) || false
  }

  const getAdjacentModules = () => {
    if (!course || !currentModule) return { prev: null, next: null }
    
    const currentIndex = course.modules.findIndex(m => m._id === currentModule._id)
    return {
      prev: currentIndex > 0 ? course.modules[currentIndex - 1] : null,
      next: currentIndex < course.modules.length - 1 ? course.modules[currentIndex + 1] : null,
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-[400px] bg-muted rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!isLoading && (!course || !currentModule)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The module you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href={`/learn/${params.courseId}`}
            className="text-primary hover:underline"
          >
            Return to Course
          </Link>
        </motion.div>
      </div>
    )
  }

  const { prev, next } = getAdjacentModules()

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href={`/learn/${course?._id || params.courseId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" />
          Back to Course
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          {currentModule?.title || 'Module Content'}
        </h1>

        <div className="text-muted-foreground mb-8 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {currentModule?.content?.length ? `${Math.ceil(currentModule.content.length / 500)} min read` : 'Reading time unavailable'}
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          {currentModule?.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {currentModule.content}
            </ReactMarkdown>
          ) : (
            <p>No content available for this module.</p>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-between pt-8 border-t"
      >
        {prev ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ x: -5 }}
          >
            <Link
              href={`/learn/${params.courseId}/${prev._id}`}
              className={cn(
                "flex items-center gap-2 text-sm bg-card hover:bg-muted/50 border rounded-lg px-4 py-3 transition-colors",
                isModuleCompleted(prev._id) 
                  ? "border-green-500/20 text-green-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <div>
                <div className="font-medium">{prev.title}</div>
                <div className="text-xs text-muted-foreground">Previous Module</div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div />
        )}

        {next && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ x: 5 }}
          >
            <Link
              href={`/learn/${params.courseId}/${next._id}`}
              className={cn(
                "flex items-center gap-2 text-sm bg-card hover:bg-muted/50 border rounded-lg px-4 py-3 transition-colors",
                isModuleCompleted(next._id) 
                  ? "border-green-500/20 text-green-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="text-right">
                <div className="font-medium">{next.title}</div>
                <div className="text-xs text-muted-foreground">Next Module</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Module Navigation */}
      <div className="border-t pt-8 mt-8">
        <div className="flex justify-between">
          {prev && (
            <Link
              href={`/learn/${params.courseId}/${prev._id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" />
              <div>
                <div className="text-xs">Previous</div>
                <div>{prev.title}</div>
              </div>
            </Link>
          )}
          
          <div className="flex-1"></div>
          
          {next && (
            <Link
              href={`/learn/${params.courseId}/${next._id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground group"
            >
              <div className="text-right">
                <div className="text-xs">Next</div>
                <div>{next.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-[3px] transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ModulePage({ params }: { params: { courseId: string; moduleId: string } }) {
  return (
    <PageLayout>
      <HydrationWrapper>
        <ModuleContent params={params} />
      </HydrationWrapper>
    </PageLayout>
  )
} 