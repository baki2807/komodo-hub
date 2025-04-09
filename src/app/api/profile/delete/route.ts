import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { users, userProgress, posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's database ID from clerk ID
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (!dbUser || dbUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user's posts
    await db
      .delete(posts)
      .where(eq(posts.authorId, dbUser[0].id))

    // Delete user's progress
    await db
      .delete(userProgress)
      .where(eq(userProgress.userId, dbUser[0].id))

    // Delete user's profile
    await db
      .delete(users)
      .where(eq(users.clerkId, userId))

    // Note: Clerk's delete functionality is handled through their dashboard
    // We'll redirect the user to their account settings
    return NextResponse.json({ 
      message: 'Account deleted successfully',
      redirectTo: 'https://dashboard.clerk.com/account'
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
} 