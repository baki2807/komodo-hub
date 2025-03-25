import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'

// Specify that this is a dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const moduleId = url.searchParams.get('moduleId')

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    
    // Check if lessons already exist for this module
    const existingLessons = await db.collection('lessons')
      .find({ moduleId })
      .sort({ order: 1 })
      .toArray()

    if (existingLessons.length === 0) {
      // Sample lessons data for the module
      const sampleLessons = [
        {
          moduleId,
          title: "Understanding the Topic",
          content: `
            <h2>Welcome to this Module</h2>
            <p>This module introduces you to the rich biodiversity of Indonesia, with a focus on the Komodo dragon and its ecosystem. Indonesia is home to approximately 17% of the world's species, making it one of the most biodiverse countries on the planet.</p>
            
            <h3>What You'll Learn</h3>
            <ul>
              <li>The unique ecological characteristics of Indonesian wildlife</li>
              <li>The importance of Komodo dragons as a keystone species</li>
              <li>Conservation challenges specific to Indonesian ecosystems</li>
              <li>Current conservation initiatives and their impacts</li>
            </ul>
            
            <p>Indonesia's archipelago of over 17,000 islands creates unique isolated ecosystems where distinct species have evolved. The country is home to approximately 300,000 animal species, representing 17% of the world's total.</p>
          `,
          type: "text",
          order: 1,
          duration: "15m"
        },
        {
          moduleId,
          title: "Key Species and Ecosystems",
          content: `
            <h2>Indonesia's Wildlife Treasures</h2>
            <p>Indonesia hosts numerous endemic species found nowhere else on Earth. The Komodo dragon, as the world's largest lizard, is one of Indonesia's most iconic species.</p>
            
            <h3>Major Ecosystems in Indonesia</h3>
            <ul>
              <li>Tropical rainforests (Sumatra, Kalimantan, Papua)</li>
              <li>Coral reefs (Raja Ampat, Bunaken, Wakatobi)</li>
              <li>Mangrove forests (coastal regions)</li>
              <li>Savanna ecosystems (Komodo National Park)</li>
            </ul>
            
            <h3>Focus: Komodo National Park</h3>
            <p>Komodo National Park, established in 1980, spans 1,733 km² with three major islands: Komodo, Rinca, and Padar. The park protects not only the Komodo dragon but also a rich marine environment with over 1,000 fish species and 260 species of reef-building coral.</p>
            
            <p>The park represents the unique blend of Australian and Asian wildlife that characterizes Wallacea, the biogeographical area between these two continental regions.</p>
          `,
          type: "text",
          order: 2,
          duration: "20m"
        },
        {
          moduleId,
          title: "Conservation Challenges",
          content: `
            <h2>Threats to Indonesian Wildlife</h2>
            <p>Despite its rich biodiversity, Indonesia faces numerous conservation challenges that threaten its unique ecosystems and species.</p>
            
            <h3>Major Threats</h3>
            <ul>
              <li>Deforestation for palm oil and timber (17% of forests lost in the past 20 years)</li>
              <li>Illegal wildlife trade ($23 billion annual industry in Southeast Asia)</li>
              <li>Climate change (sea level rise, coral bleaching)</li>
              <li>Human-wildlife conflict (particularly in growing population areas)</li>
            </ul>
            
            <h3>Komodo-Specific Challenges</h3>
            <p>Komodo dragons face unique threats including:</p>
            <ul>
              <li>Habitat loss due to human encroachment</li>
              <li>Decline in prey populations</li>
              <li>Poaching (despite protected status)</li>
              <li>Tourism impacts on behavior and habitat</li>
              <li>Potential genetic isolation of populations</li>
            </ul>
          `,
          type: "text",
          order: 3,
          duration: "25m"
        },
        {
          moduleId,
          title: "Conservation Success Stories",
          content: `
            <h2>Positive Conservation Outcomes</h2>
            <p>Despite numerous challenges, Indonesia has achieved several conservation successes worth celebrating and learning from.</p>
            
            <h3>Success Stories</h3>
            <ul>
              <li>Komodo dragon population increase (from approximately 3,000 to 3,700 individuals since 2000)</li>
              <li>Marine Protected Area expansion (20 million hectares protected by 2020)</li>
              <li>Community-based conservation on Flores Island</li>
              <li>Eco-tourism development creating economic incentives for conservation</li>
            </ul>
            
            <h3>Looking Forward</h3>
            <p>Conservation in Indonesia continues to evolve with innovative approaches:</p>
            <ul>
              <li>Integration of traditional ecological knowledge with scientific research</li>
              <li>Development of sustainable financing mechanisms</li>
              <li>Improved monitoring using technology (camera traps, eDNA, satellite tracking)</li>
              <li>Enhanced international cooperation through agreements like CITES</li>
            </ul>
            
            <p>In the next module, we'll explore in more detail how these conservation approaches are being implemented in specific contexts across Indonesia.</p>
          `,
          type: "text",
          order: 4,
          duration: "15m"
        }
      ]

      // Insert the sample lessons
      await db.collection('lessons').insertMany(sampleLessons)
      
      return NextResponse.json(sampleLessons)
    }

    return NextResponse.json(existingLessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
} 