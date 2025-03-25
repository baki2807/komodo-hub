'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, ChevronRight, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Module {
  _id: string
  title: string
  content: string
}

interface ModuleCardProps {
  courseId: string
  module: Module
  moduleIndex: number
  isCompleted: boolean
  onComplete: (moduleId: string) => void
  totalLessons: number
  completedLessons: number
}

export const ModuleCard = ({
  courseId,
  module,
  moduleIndex,
  isCompleted,
  onComplete,
  totalLessons,
  completedLessons
}: ModuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const lessonProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + moduleIndex * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative mb-4"
    >
      <div className={`
        border rounded-xl overflow-hidden transition-all duration-300
        ${isHovered ? 'shadow-md' : 'shadow-sm'}
        ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/50'}
      `}>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${isCompleted ? 'bg-primary/10' : 'bg-primary/5'}
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-primary" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-1 group-hover:text-primary transition-colors">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-3 w-full max-w-[150px]">
                    <Progress value={lessonProgress} className="h-1.5" />
                    <span>{lessonProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="shrink-0">
              {isCompleted ? (
                <div className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full font-medium">
                  Completed
                </div>
              ) : (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault()
                      onComplete(module._id)
                    }}
                  >
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Link href={`/learn/${courseId}/${module._id}`} className="block">
          <div className={`
            p-3 border-t flex items-center justify-between text-sm
            ${isCompleted ? 'border-primary/10 bg-primary/5' : 'border-border/50 bg-muted/30'}
            ${isHovered ? 'bg-primary/10' : ''}
          `}>
            <span className={isHovered ? 'text-primary' : ''}>
              {completedLessons === 0 ? 'Start Module' : 
              completedLessons < totalLessons ? 'Continue Module' : 'Review Module'}
            </span>
            <ChevronRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1 text-primary' : ''}`} />
          </div>
        </Link>
      </div>
    </motion.div>
  )
} 