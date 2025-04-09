'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, ArrowRight, Clock, Leaf, Globe, Fish, Map, TreePine, Shield, AlertTriangle, Bird, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { HydrationWrapper } from '@/components/ui/hydration-wrapper'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/ui/markdown'
import { motion } from 'framer-motion'
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

// Define the IconComponent for section headers
const SectionIcon = ({ type }: { type: string }) => {
  const iconClassName = "w-5 h-5 inline-block mr-2";
  
  switch(type) {
    case 'hotspot':
      return <Map className={cn(iconClassName, "text-primary")} />;
    case 'marine':
      return <Fish className={cn(iconClassName, "text-blue-500")} />;
    case 'sundaland':
      return <TreePine className={cn(iconClassName, "text-green-600")} />;
    case 'wallacea':
      return <Globe className={cn(iconClassName, "text-indigo-500")} />;
    case 'papua':
      return <Leaf className={cn(iconClassName, "text-green-500")} />;
    case 'status':
      return <AlertTriangle className={cn(iconClassName, "text-amber-500")} />;
    case 'why':
      return <Shield className={cn(iconClassName, "text-purple-500")} />;
    case 'species':
      return <PawPrint className={cn(iconClassName, "text-rose-500")} />;
    case 'birds':
      return <Bird className={cn(iconClassName, "text-cyan-500")} />;
    default:
      return null;
  }
};

// A component for statistics in biodiversity content
const BiodiversityStat = ({ figure, text }: { figure: string; text: string }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-card/60 backdrop-blur-sm rounded-lg px-5 py-4 shadow-sm hover:shadow border border-border/50"
    >
      <h4 className="text-xl font-bold text-primary mb-1">{figure}</h4>
      <p className="text-muted-foreground text-sm">{text}</p>
    </motion.div>
  );
};

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

  // Identify section type for proper icon display
  const getSectionType = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('hotspot')) return 'hotspot';
    if (lowercaseTitle.includes('marine')) return 'marine';
    if (lowercaseTitle.includes('sundaland')) return 'sundaland';
    if (lowercaseTitle.includes('wallacea')) return 'wallacea';
    if (lowercaseTitle.includes('papua')) return 'papua';
    if (lowercaseTitle.includes('status')) return 'status';
    if (lowercaseTitle.includes('matter')) return 'why';
    if (lowercaseTitle.includes('species')) return 'species';
    if (lowercaseTitle.includes('bird')) return 'birds';
    return '';
  };

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
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          {currentModule?.title || 'Module Content'}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 mb-8 text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>
              {currentModule?.content?.length ? `${Math.ceil(currentModule.content.length / 500)} min read` : 'Reading time unavailable'}
            </span>
          </div>
          {userProgress?.completedModules?.includes(currentModule?._id || '') && (
            <div className="flex items-center gap-1.5 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </div>
          )}
        </motion.div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8 md:prose-headings:text-primary">
          {currentModule?.content ? (
            <div className="learning-content">
              <style jsx global>{`
                .learning-content h2 {
                  background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 0%, transparent 100%);
                  padding: 0.8rem 1rem;
                  border-radius: 0.5rem;
                  margin-top: 2rem;
                  margin-bottom: 1.5rem;
                  border-left: 4px solid rgb(var(--primary));
                  font-size: 1.5rem;
                  display: flex;
                  align-items: center;
                }
                
                .learning-content h3 {
                  color: rgb(var(--primary));
                  margin-top: 1.5rem;
                  font-size: 1.25rem;
                  border-bottom: 1px solid rgba(var(--primary-rgb), 0.2);
                  padding-bottom: 0.5rem;
                }
                
                .learning-content ul {
                  background-color: rgba(var(--card-rgb), 0.5);
                  padding: 1.25rem 1.25rem 1.25rem 2.5rem;
                  border-radius: 0.5rem;
                  margin: 1rem 0;
                  border: 1px solid rgba(var(--border-rgb), 0.2);
                }
                
                .learning-content li {
                  margin-bottom: 0.75rem;
                  position: relative;
                }
                
                .learning-content li::marker {
                  color: rgb(var(--primary));
                  font-weight: bold;
                }
                
                .learning-content strong {
                  color: rgb(var(--primary));
                  font-weight: 600;
                }
                
                .learning-content p {
                  line-height: 1.8;
                }
                
                .learning-content blockquote {
                  background-color: rgba(var(--primary-rgb), 0.05);
                  border-left: 4px solid rgb(var(--primary));
                  padding: 1rem;
                  margin: 1.5rem 0;
                  border-radius: 0.5rem;
                }
                
                .learning-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5rem 0;
                  overflow: hidden;
                  border-radius: 0.5rem;
                  border: 1px solid rgba(var(--border-rgb), 0.2);
                }
                
                .learning-content th {
                  background-color: rgba(var(--primary-rgb), 0.1);
                  color: rgb(var(--primary));
                  font-weight: 600;
                  text-align: left;
                  padding: 0.75rem 1rem;
                }
                
                .learning-content td {
                  padding: 0.75rem 1rem;
                  border-top: 1px solid rgba(var(--border-rgb), 0.2);
                }
                
                .learning-content tr:nth-child(even) {
                  background-color: rgba(var(--card-rgb), 0.3);
                }
                
                .biodiversity-stats-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                  gap: 1rem;
                  margin: 1.5rem 0;
                }
                
                .location-card {
                  background: rgba(var(--card-rgb), 0.4);
                  border-radius: 0.75rem;
                  padding: 1.25rem;
                  margin-bottom: 1.5rem;
                  border: 1px solid rgba(var(--border-rgb), 0.2);
                  transition: all 0.2s ease;
                }
                
                .location-card:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                
                .location-card h3 {
                  margin-top: 0 !important;
                  padding-bottom: 0.5rem;
                  border-bottom: 1px solid rgba(var(--border-rgb), 0.2);
                }
                
                .location-property {
                  margin-top: 0.75rem;
                }
                
                .location-property-label {
                  font-weight: 600;
                  color: rgb(var(--primary));
                  margin-bottom: 0.25rem;
                }
                
                .species-list {
                  margin-top: 0 !important;
                }
                
                .section-heading {
                  animation: fadeInSlide 0.6s ease-out;
                }
                
                .fade-in {
                  animation: fadeIn 0.8s ease-out;
                }
                
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
                
                @keyframes fadeInSlide {
                  from {
                    opacity: 0;
                    transform: translateX(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }
              `}</style>

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => {
                    const title = typeof props.children === 'string' 
                      ? props.children
                      : Array.isArray(props.children) && props.children.length > 0 && typeof props.children[0] === 'string'
                        ? props.children[0]
                        : '';
                    
                    const sectionType = getSectionType(title);
                    
                    return (
                      <h2 {...props} className="section-heading">
                        {sectionType && <SectionIcon type={sectionType} />}
                        {props.children}
                      </h2>
                    );
                  },
                  h3: ({ node, ...props }) => {
                    return (
                      <h3 {...props} className="text-primary font-semibold">
                        {props.children}
                      </h3>
                    );
                  },
                  ul: ({ node, ...props }) => {
                    return (
                      <ul {...props} className="my-4 bg-muted/30 p-4 rounded-lg">
                        {props.children}
                      </ul>
                    );
                  },
                  li: ({ node, ...props }) => {
                    return (
                      <li {...props} className="hover:translate-x-1 transition-transform duration-200">
                        {props.children}
                      </li>
                    );
                  },
                  strong: ({ node, ...props }) => {
                    return (
                      <strong {...props} className="text-primary font-semibold">
                        {props.children}
                      </strong>
                    );
                  },
                  p: ({ node, ...props }) => {
                    // Transform text statistics into visual components
                    const text = typeof props.children === 'string' ? props.children : '';
                    
                    // Check for statistics pattern (e.g., "Contains approximately 17% of the world's species")
                    if (text.includes('%') || (text.includes('Houses') && text.includes('%'))) {
                      const matches = text.match(/(\d+%|\d+,\d+\+?|\d+\+?)/g);
                      if (matches && matches.length > 0) {
                        return (
                          <div className="biodiversity-stats-grid">
                            <BiodiversityStat 
                              figure={matches[0]} 
                              text={text.replace(matches[0], '').trim()} 
                            />
                          </div>
                        );
                      }
                    }
                    
                    return (
                      <p {...props} className="fade-in">
                        {props.children}
                      </p>
                    );
                  }
                }}
              >
                {currentModule.content}
              </ReactMarkdown>
            </div>
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
        {/* Complete Module Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex-1 flex justify-center mx-4"
        >
          <Button
            size="lg"
            onClick={handleCompleteModule}
            disabled={isCompleting || isModuleCompleted(currentModule?._id || '')}
            className={cn(
              "flex items-center gap-2 transition-all",
              isModuleCompleted(currentModule?._id || '') 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {isCompleting ? (
              "Completing..."
            ) : isModuleCompleted(currentModule?._id || '') ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Completed
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </>
            )}
          </Button>
        </motion.div>
        
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