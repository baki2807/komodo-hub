import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { messages, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const messageId = params.messageId
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Get current user's database ID
    const [currentDbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (!currentDbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the message to verify it belongs to the current user
    const [messageToDelete] = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.id, messageId),
          eq(messages.senderId, currentDbUser.id)
        )
      )
      .limit(1)

    if (!messageToDelete) {
      return NextResponse.json(
        { error: 'Message not found or you are not authorized to delete it' },
        { status: 404 }
      )
    }

    // Delete the message
    await db
      .delete(messages)
      .where(eq(messages.id, messageId))

    return NextResponse.json({ 
      success: true,
      message: 'Message deleted successfully' 
    })
  } catch (error) {
    console.error('DELETE /api/messages/[messageId] - Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
} 