import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    // First, check if we have any existing courses
    const existingCoursesCount = await db
      .select({ count: courses.id })
      .from(courses)
      .then(result => result.length)
    
    console.log(`Found ${existingCoursesCount} existing courses in database`)
    
    // If we already have courses, just return success
    if (existingCoursesCount > 0) {
      return NextResponse.json({ 
        message: 'Courses already exist in database', 
        count: existingCoursesCount
      })
    }

    // Insert sample courses
    const sampleCourses = [
      {
        title: "Introduction to Indonesian Wildlife",
        description: "Discover Indonesia's incredible biodiversity and the challenges of wildlife conservation in this archipelago nation.",
        imageUrl: "/images/courses/indonesian-wildlife.jpg",
        level: "Beginner",
        modules: [
          {
            id: "intro-1",
            title: "Welcome to Indonesian Wildlife",
            content: "Learn about the unique ecosystems and species of Indonesia.",
            order: 1
          },
          {
            id: "intro-2",
            title: "Conservation Challenges",
            content: "Understanding the threats facing Indonesian wildlife.",
            order: 2
          }
        ]
      },
      {
        title: "Komodo Dragon Conservation",
        description: "Deep dive into the world of Komodo dragons and their conservation.",
        imageUrl: "/images/courses/komodo-dragon.jpg",
        level: "Intermediate",
        modules: [
          {
            id: "komodo-1",
            title: "Komodo Dragon Biology",
            content: "Understanding the unique biology of Komodo dragons.",
            order: 1
          },
          {
            id: "komodo-2",
            title: "Conservation Efforts",
            content: "Current conservation strategies for Komodo dragons.",
            order: 2
          }
        ]
      }
    ]

    try {
      const insertedCourses = await db
        .insert(courses)
        .values(sampleCourses)
        .returning()

      return NextResponse.json({ 
        message: 'Sample courses added successfully',
        insertedCount: insertedCourses.length
      })
    } catch (insertError) {
      console.error('Error inserting courses:', insertError)
      return NextResponse.json({ 
        message: 'Error inserting courses. Database might be already populated.',
        error: insertError instanceof Error ? insertError.message : String(insertError),
        details: JSON.stringify(insertError)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error),
      details: JSON.stringify(error)
    }, { status: 500 })
  }
} 