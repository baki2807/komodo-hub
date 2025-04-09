const { Client } = require('pg')

async function initCourses() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Check for existing courses
    const existingCoursesResult = await client.query('SELECT COUNT(*) FROM courses')
    const existingCount = parseInt(existingCoursesResult.rows[0].count)
    
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing courses, skipping initialization`)
      return
    }

    // Sample courses data
    const sampleCourses = [
      {
        title: "Introduction to Indonesian Wildlife",
        description: "Discover Indonesia's incredible biodiversity and the challenges of wildlife conservation in this archipelago nation.",
        image_url: "/images/courses/indonesian-wildlife.jpg",
        level: "Beginner",
        modules: JSON.stringify([
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
        ])
      },
      {
        title: "Komodo Dragon Conservation",
        description: "Deep dive into the world of Komodo dragons and their conservation.",
        image_url: "/images/courses/komodo-dragon.jpg",
        level: "Intermediate",
        modules: JSON.stringify([
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
        ])
      }
    ]

    // Insert courses
    for (const course of sampleCourses) {
      await client.query(
        'INSERT INTO courses (title, description, image_url, level, modules) VALUES ($1, $2, $3, $4, $5)',
        [course.title, course.description, course.image_url, course.level, course.modules]
      )
    }

    console.log('Successfully initialized courses')
  } catch (error) {
    console.error('Error initializing courses:', error)
  } finally {
    await client.end()
    console.log('Disconnected from database')
  }
}

initCourses() 