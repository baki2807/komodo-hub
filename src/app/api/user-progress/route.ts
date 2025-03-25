import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { userProgress, users, courses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return new NextResponse('Course ID is required', { status: 400 })
    }

    // Get user's database ID from clerk ID
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1)

    if (!dbUser || dbUser.length === 0) {
      // Create a new user if they don't exist yet
      try {
        const [newUser] = await db
          .insert(users)
          .values({
            clerkId: clerkId,
            email: 'temp@example.com', // This will be updated by the Clerk webhook
            firstName: '',
            lastName: ''
          })
          .returning()
        
        // Return empty progress for new user
        return NextResponse.json({
          completedModules: [],
          lastAccessed: new Date()
        })
      } catch (insertError) {
        console.error('Error creating new user:', insertError)
        // Return empty progress if user creation fails
        return NextResponse.json({
          completedModules: [],
          lastAccessed: new Date()
        })
      }
    }

    // Handle special case for dashboard overview
    if (courseId === 'all') {
      try {
        const allProgress = await db
          .select()
          .from(userProgress)
          .where(eq(userProgress.userId, dbUser[0].id))

        const allCourses = await db
          .select()
          .from(courses)

        const totalCompletedModules = allProgress.reduce((acc, curr) => 
          acc + ((curr.completedModules?.length || 0)), 0)
        
        const totalModules = allCourses.reduce((acc, course) => 
          acc + ((course.modules?.length || 0)), 0)
        
        return NextResponse.json({
          completedModules: Array(totalCompletedModules).fill(''),
          totalModules,
          lastAccessed: new Date()
        })
      } catch (error) {
        console.error('Error in all courses progress calculation:', error)
        // Return default values on error
        return NextResponse.json({
          completedModules: [],
          totalModules: 0,
          lastAccessed: new Date()
        })
      }
    }

    // Get specific course progress
    try {
      // First check if the course exists with the given ID
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)
      
      if (!course || course.length === 0) {
        return NextResponse.json({
          completedModules: [],
          lastAccessed: new Date()
        })
      }
      
      const progress = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, dbUser[0].id),
            eq(userProgress.courseId, courseId)
          )
        )
        .limit(1)

      if (!progress || progress.length === 0) {
        return NextResponse.json({
          completedModules: [],
          lastAccessed: new Date()
        })
      }

      return NextResponse.json({
        _id: progress[0].id,
        userId: dbUser[0].id,
        courseId: courseId,
        completedModules: progress[0].completedModules || [],
        lastAccessed: progress[0].lastAccessed
      })
    } catch (error) {
      console.error('Error fetching specific course progress:', error)
      return NextResponse.json({
        completedModules: [],
        lastAccessed: new Date()
      })
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { courseId, moduleId } = body

    if (!courseId || !moduleId) {
      return new NextResponse('Course ID and Module ID are required', { status: 400 })
    }

    // Get user's database ID from clerk ID
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1)

    if (!dbUser || dbUser.length === 0) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Update or create progress
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, dbUser[0].id),
          eq(userProgress.courseId, courseId)
        )
      )
      .limit(1)

    if (!existingProgress || existingProgress.length === 0) {
      // Create new progress
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId: dbUser[0].id,
          courseId: courseId,
          completedModules: [moduleId],
          lastAccessed: new Date()
        })
        .returning()

      return NextResponse.json(newProgress)
    } else {
      // Update existing progress
      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          completedModules: [...(existingProgress[0].completedModules || []), moduleId],
          lastAccessed: new Date()
        })
        .where(
          and(
            eq(userProgress.userId, dbUser[0].id),
            eq(userProgress.courseId, courseId)
          )
        )
        .returning()

      return NextResponse.json(updatedProgress)
    }
  } catch (error) {
    console.error('Error updating user progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 