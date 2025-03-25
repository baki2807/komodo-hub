import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq, ilike } from 'drizzle-orm'

export async function GET() {
  try {
    // Instead of deleting courses, check if they exist first
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
            id: crypto.randomUUID(),
            title: "Indonesia's Biodiversity Hotspots",
            content: "Indonesia is one of the world's 17 megadiverse countries, containing up to 17% of the world's species. This module introduces key regions and their unique wildlife.",
            order: 1
          },
          {
            id: crypto.randomUUID(),
            title: "Conservation Challenges in Indonesia",
            content: "Explore the major threats to Indonesian wildlife including deforestation, illegal wildlife trade, and habitat fragmentation.",
            order: 2
          },
          {
            id: crypto.randomUUID(),
            title: "Indigenous Conservation Practices",
            content: "Learn how traditional ecological knowledge has contributed to conservation in Indonesia for centuries.",
            order: 3
          },
          {
            id: crypto.randomUUID(),
            title: "Current Conservation Initiatives",
            content: "Overview of major conservation programs and how they're working to protect Indonesia's wildlife.",
            order: 4
          }
        ]
      },
      {
        title: "Komodo Dragon Ecology & Conservation",
        description: "An in-depth exploration of the world's largest lizard, its unique ecosystem, and ongoing conservation efforts.",
        imageUrl: "/images/courses/komodo-ecology.jpg",
        level: "Intermediate",
        modules: [
          {
            id: crypto.randomUUID(),
            title: "Komodo Dragon Biology & Behavior",
            content: "Study the unique biology, hunting strategies, and social behavior of Varanus komodoensis.",
            order: 1
          },
          {
            id: crypto.randomUUID(),
            title: "Komodo National Park Ecosystem",
            content: "Explore the terrestrial and marine ecosystems that make up the habitat of the Komodo dragon.",
            order: 2
          },
          {
            id: crypto.randomUUID(),
            title: "Threats to Komodo Dragon Populations",
            content: "Examine human-wildlife conflict, climate change impacts, and other challenges facing Komodo dragon conservation.",
            order: 3
          },
          {
            id: crypto.randomUUID(),
            title: "Conservation Management Strategies",
            content: "Learn about current conservation approaches, monitoring techniques, and protective regulations.",
            order: 4
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
        message: 'Error inserting courses',
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