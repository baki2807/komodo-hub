'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, ChevronLeft, ChevronRight, BookOpen, FileText, AlertCircle } from 'lucide-react'
import Markdown from 'react-markdown'
import { Progress } from '@/components/ui/progress'

interface Content {
  title: string
  content: string | string[]
}

interface Activity {
  title: string
  description: string
}

export interface Lesson {
  title: string
  duration: string
  objectives?: string[]
  content: Content[]
  activities?: Activity[]
  discussionQuestions?: string[]
}

interface ModuleViewerProps {
  lessons: Lesson[]
  initialLesson?: number
  onComplete?: () => void
  onLessonChange?: (index: number) => void
}

export const ModuleViewer = ({ 
  lessons, 
  initialLesson = 0,
  onComplete,
  onLessonChange
}: ModuleViewerProps) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLesson)
  const [activeSection, setActiveSection] = useState('content') // content, activities, discussion
  
  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      setActiveSection('content')
      if (onLessonChange) {
        onLessonChange(currentLessonIndex + 1)
      }
    } else if (onComplete) {
      onComplete()
    }
  }
  
  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      setActiveSection('content')
      if (onLessonChange) {
        onLessonChange(currentLessonIndex - 1)
      }
    }
  }
  
  if (!lessons || lessons.length === 0) {
    return (
      <div className="p-8 border rounded-xl bg-card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Content Available</h3>
            <p className="text-muted-foreground">
              This module doesn't have any content yet.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  const currentLesson = lessons[currentLessonIndex]
  const progress = ((currentLessonIndex + 1) / lessons.length) * 100
  
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc pl-5 space-y-2">
          {content.map((item, i) => (
            <li key={i} className="text-base">
              <Markdown>{item}</Markdown>
            </li>
          ))}
        </ul>
      )
    } else {
      return <Markdown>{content}</Markdown>
    }
  }
  
  const isLastLesson = currentLessonIndex === lessons.length - 1
  
  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b bg-card/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-0">{currentLesson.title}</h3>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm text-muted-foreground mr-2">{currentLesson.duration}</span>
            <span className="text-xs sm:text-sm font-medium">{currentLessonIndex + 1}/{lessons.length}</span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b overflow-x-auto">
        <button
          onClick={() => setActiveSection('content')}
          className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
            activeSection === 'content' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:text-primary/80 hover:border-primary/30'
          }`}
        >
          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
          Content
        </button>
        
        {currentLesson.activities && (
          <button
            onClick={() => setActiveSection('activities')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
              activeSection === 'activities' 
                ? 'border-primary text-primary' 
                : 'border-transparent hover:text-primary/80 hover:border-primary/30'
            }`}
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
            Activities
          </button>
        )}
        
        {currentLesson.discussionQuestions && (
          <button
            onClick={() => setActiveSection('discussion')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
              activeSection === 'discussion' 
                ? 'border-primary text-primary' 
                : 'border-transparent hover:text-primary/80 hover:border-primary/30'
            }`}
          >
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
            Discussion
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {activeSection === 'content' && (
          <div>
            {currentLesson.objectives && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-primary mb-2">Learning Objectives</h4>
                <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                  {currentLesson.objectives.map((objective, i) => (
                    <li key={i} className="text-xs sm:text-sm text-muted-foreground">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-6 sm:space-y-8">
              {currentLesson.content.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="space-y-2 sm:space-y-3"
                >
                  <h4 className="text-base sm:text-lg font-medium">{section.title}</h4>
                  <div className="prose dark:prose-invert prose-sm max-w-none leading-relaxed text-sm sm:text-base">
                    {renderContent(section.content)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {activeSection === 'activities' && currentLesson.activities && (
          <div className="space-y-4 sm:space-y-6">
            {currentLesson.activities.map((activity, i) => (
              <div key={i} className="p-3 sm:p-5 border rounded-lg">
                <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">{activity.title}</h4>
                <div className="text-sm sm:text-base">
                  <Markdown>{activity.description}</Markdown>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeSection === 'discussion' && currentLesson.discussionQuestions && (
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-medium">Discussion Questions</h4>
            <ul className="space-y-3 pl-4 sm:pl-5 list-disc">
              {currentLesson.discussionQuestions.map((question, i) => (
                <li key={i} className="text-sm sm:text-base">
                  <Markdown>{question}</Markdown>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentLessonIndex === 0}
          className="space-x-1 text-xs sm:text-sm h-8 sm:h-9"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Previous</span>
        </Button>
        
        <Button
          size="sm"
          onClick={handleNext}
          className="space-x-1 text-xs sm:text-sm h-8 sm:h-9"
        >
          <span>{isLastLesson ? 'Complete' : 'Next'}</span>
          {isLastLesson ? (
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

// Sample course content for testing purposes
export const courseContent: Lesson[] = [
  {
    title: "Introduction to Conservation",
    duration: "30m",
    objectives: [
      "Define wildlife conservation and its importance",
      "Understand key historical developments",
      "Identify current conservation challenges"
    ],
    content: [
      {
        title: "What is Wildlife Conservation?",
        content: "Wildlife conservation means protecting wild animals and their homes. This includes:\n- Saving endangered species\n- Protecting natural habitats\n- Using natural resources wisely\n- Maintaining healthy ecosystems"
      },
      {
        title: "Brief History of Conservation",
        content: [
          "Early 1900s: First national parks and wildlife refuges established",
          "1960s-1970s: Major environmental laws created (Endangered Species Act)",
          "Today: Focus on combining science, community involvement, and sustainable development"
        ]
      },
      {
        title: "Main Conservation Challenges",
        content: [
          "Habitat Loss: Wild areas being converted to farms, cities, and roads",
          "Climate Change: Altering habitats and wildlife behavior",
          "Overexploitation: Taking too many animals through hunting and fishing",
          "Pollution: Contaminating air, water, and soil",
          "Invasive Species: Non-native plants and animals harming local wildlife"
        ]
      },
      {
        title: "Conservation Approaches",
        content: "Conservation today combines knowledge from:\n- Biology and ecology\n- Social sciences\n- Economics\n- Policy and governance"
      }
    ],
    discussionQuestions: [
      "Why should we care about saving wildlife?",
      "What conservation challenges do you see in your area?",
      "How have attitudes toward conservation changed over time?"
    ]
  },
  {
    title: "Indonesian Biodiversity",
    duration: "45m",
    objectives: [
      "Understand Indonesia's unique ecological importance",
      "Identify key biodiversity hotspots in Indonesia",
      "Recognize endemic species and their conservation status"
    ],
    content: [
      {
        title: "Indonesia's Global Significance",
        content: "Indonesia contains:\n- 17% of the world's species\n- The world's 3rd largest rainforest\n- The world's highest marine biodiversity\n- 17,000+ islands creating unique evolutionary conditions"
      },
      {
        title: "Key Biodiversity Hotspots",
        content: [
          "Wallacea (Sulawesi, Maluku): A transition zone with unique species evolution",
          "Sundaland (Sumatra, Java, Borneo): Home to orangutans, tigers, and rhinos",
          "Coral Triangle: The epicenter of global marine biodiversity",
          "Papua: Remote forests with countless undiscovered species"
        ]
      },
      {
        title: "Endemic Species",
        content: "Indonesia has many species found nowhere else, including:\n- Komodo Dragon (Varanus komodoensis)\n- Orangutans (Pongo species)\n- Rafflesia arnoldii (world's largest flower)\n- Babirusa (deer-pig)\n- Bird of Paradise species\n- Hundreds of unique reef fish"
      },
      {
        title: "Conservation Status",
        content: "Indonesia faces serious conservation challenges:\n- 25% of mammals and 14% of birds threatened with extinction\n- 80% of original forest cover already lost\n- 40% of coral reefs severely damaged\n- One of the highest deforestation rates globally\n- Several unique species already lost (Bali tiger, Java tiger)"
      }
    ],
    activities: [
      {
        title: "Indonesian Species Identification",
        description: "Using online resources, identify 5 endemic Indonesian species and note their conservation status and threats."
      }
    ],
    discussionQuestions: [
      "What factors have made Indonesia so biodiverse?",
      "What unique cultural values do Indonesians attach to their wildlife?",
      "How can Indonesia balance economic development with conservation?"
    ]
  }
] 