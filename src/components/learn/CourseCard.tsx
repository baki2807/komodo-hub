'use client'

import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  level: string
  modules: any[]
}

interface CourseCardProps {
  course: Course
  progress: number
  index: number
}

export const CourseCard = ({ course, progress, index }: CourseCardProps) => {
  // Map course levels to specific badge colors
  const levelColors = {
    'Beginner': 'bg-green-500 text-green-50',
    'Intermediate': 'bg-blue-500 text-blue-50',
    'Advanced': 'bg-purple-500 text-purple-50'
  }
  
  // Default color if level doesn't match
  const badgeColor = levelColors[course.level as keyof typeof levelColors] || 'bg-primary text-primary-foreground'
  
  // Icons specific to Indonesian conservation for different course types
  const courseIcons = {
    'Komodo': '/images/icons/komodo.svg',
    'Marine': '/images/icons/coral.svg',
    'Community': '/images/icons/community.svg',
    'Wildlife': '/images/icons/wildlife.svg',
    'default': '/images/icons/conservation.svg'
  }
  
  // Select icon based on course title keywords
  const getIconPath = (title: string) => {
    if (title.includes('Komodo')) return courseIcons.Komodo
    if (title.includes('Marine')) return courseIcons.Marine
    if (title.includes('Community')) return courseIcons.Community
    if (title.includes('Wildlife')) return courseIcons.Wildlife
    return courseIcons.default
  }

  // Ensure course has a valid ID
  const courseId = course._id || `temp-course-${index}`
  const isValidCourse = !!course._id && course._id !== 'undefined'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/50"
    >
      <div className="relative h-52 overflow-hidden">
        {/* Fallback image if thumbnail is missing */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/20"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.img
          src={course.thumbnail || '/images/courses/default-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute top-3 right-3">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`px-3 py-1.5 ${badgeColor} rounded-full text-xs font-medium tracking-wide shadow-lg`}
          >
            {course.level}
          </motion.span>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white mb-3">
            <span className="text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full">
              {course.modules?.length || 0} modules
            </span>
            <img 
              src={getIconPath(course.title)}
              alt="Course icon"
              className="w-8 h-8 bg-white/10 p-1.5 rounded-full"
            />
          </div>
          
          <Progress value={progress} className="h-1.5 bg-white/20" />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
          {course.description}
        </p>
        {isValidCourse ? (
          <Link href={`/learn/${courseId}`}>
            <Button variant="outline" className="w-full group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
              {progress > 0 ? 'Continue Learning' : 'Start Course'}
              <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="w-full opacity-70">
            Coming Soon
          </Button>
        )}
      </div>
    </motion.div>
  )
} 