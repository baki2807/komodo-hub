import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'

export async function GET() {
  try {
    // Delete all existing courses
    await db.delete(courses)

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
      },
      {
        title: "Community-Based Conservation in Indonesia",
        description: "Discover how local communities are becoming stewards of Indonesia's precious biodiversity.",
        imageUrl: "/images/courses/community-conservation.jpg",
        level: "Advanced",
        modules: [
          {
            id: crypto.randomUUID(),
            title: "Local Community Engagement Models",
            content: "Explore successful models of involving communities in wildlife protection across Indonesian islands.",
            order: 1
          },
          {
            id: crypto.randomUUID(),
            title: "Ecotourism & Sustainable Livelihoods",
            content: "Learn how conservation-based tourism is creating economic opportunities while protecting wildlife.",
            order: 2
          },
          {
            id: crypto.randomUUID(),
            title: "Education & Cultural Programs",
            content: "Discover approaches to building conservation awareness and support among local populations.",
            order: 3
          },
          {
            id: crypto.randomUUID(),
            title: "Measuring Community Conservation Impact",
            content: "Understand how to evaluate and improve the effectiveness of community-based conservation initiatives.",
            order: 4
          }
        ]
      },
      {
        title: "Marine Conservation in Indonesia's Waters",
        description: "Explore the rich marine biodiversity of Indonesia and strategies to protect these underwater ecosystems.",
        imageUrl: "/images/courses/marine-conservation.jpg",
        level: "Intermediate",
        modules: [
          {
            id: crypto.randomUUID(),
            title: "Coral Triangle Biodiversity",
            content: "Discover why Indonesian waters contain the highest marine diversity on the planet and the specialized ecosystems that exist there.",
            order: 1
          },
          {
            id: crypto.randomUUID(),
            title: "Threats to Indonesian Marine Life",
            content: "Examine the impacts of overfishing, plastic pollution, coral bleaching, and destructive fishing practices.",
            order: 2
          },
          {
            id: crypto.randomUUID(),
            title: "Marine Protected Areas",
            content: "Learn about Indonesia's network of MPAs, their effectiveness, and management approaches.",
            order: 3
          },
          {
            id: crypto.randomUUID(),
            title: "Sustainable Fisheries Management",
            content: "Explore how traditional and modern approaches are being combined to create sustainable fishing practices.",
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