'use client'

import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Award, BookOpen, BadgeCheck, Calendar, Trophy, Lock } from 'lucide-react'

interface CourseProgressProps {
  totalModules: number
  completedModules: number
  lastAccessedDate?: Date | null
  courseLevel: string
}

export const CourseProgress = ({
  totalModules,
  completedModules,
  lastAccessedDate,
  courseLevel
}: CourseProgressProps) => {
  const progressPercentage = Math.round((completedModules / totalModules) * 100)
  
  // Define achievements based on progress
  const achievements = [
    { 
      title: "Started Journey", 
      description: "Began your conservation learning", 
      icon: <BookOpen className="w-4 h-4" />,
      threshold: 1,
      color: "bg-blue-500"
    },
    { 
      title: "Halfway There", 
      description: "Completed 50% of the course", 
      icon: <BadgeCheck className="w-4 h-4" />,
      threshold: 50,
      color: "bg-green-500"
    },
    { 
      title: "Completion Expert", 
      description: "Completed the entire course", 
      icon: <Trophy className="w-4 h-4" />,
      threshold: 100,
      color: "bg-yellow-500"
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border rounded-xl p-5 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Course Progress</h3>
          <p className="text-sm text-muted-foreground">
            {completedModules} of {totalModules} modules completed
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {progressPercentage}% Complete
          </div>
          
          <Badge variant="outline" className="bg-card border-border">
            {courseLevel}
          </Badge>
          
          {lastAccessedDate && (
            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last accessed: {new Date(lastAccessedDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-5" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        {achievements.map((achievement, index) => {
          const isUnlocked = progressPercentage >= achievement.threshold
          
          return (
            <div 
              key={index}
              className={`flex items-center gap-3 border rounded-lg p-3 transition-all
                ${isUnlocked 
                  ? `border-${achievement.color.split('-')[1]}-300 bg-${achievement.color.split('-')[1]}-50` 
                  : 'border-muted bg-muted/10 opacity-60'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isUnlocked ? achievement.color : 'bg-muted'}
                text-white
              `}>
                {isUnlocked ? achievement.icon : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-medium">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
} 