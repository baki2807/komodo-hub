import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { userProgress, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { courseId } = body

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
      return new NextResponse('User not found', { status: 404 })
    }

    // Reset progress by setting completedModules to an empty array
    const [updatedProgress] = await db
      .update(userProgress)
      .set({
        completedModules: [],
        lastAccessed: new Date()
      })
      .where(
        and(
          eq(userProgress.userId, dbUser[0].id),
          eq(userProgress.courseId, courseId)
        )
      )
      .returning()

    if (!updatedProgress) {
      // If no record exists yet, there's nothing to reset
      return NextResponse.json({
        message: 'No progress to reset',
        success: true
      })
    }

    return NextResponse.json({
      message: 'Progress reset successfully',
      success: true,
      progress: updatedProgress
    })
  } catch (error) {
    console.error('Error resetting progress:', error)
    return NextResponse.json({
      message: 'Failed to reset progress',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 