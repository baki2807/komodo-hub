import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { messages, users } from '@/lib/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { desc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const otherUserClerkId = searchParams.get('userId')

    if (!otherUserClerkId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get database IDs for both users
    const [currentDbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    const [otherDbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, otherUserClerkId))
      .limit(1)

    if (!currentDbUser || !otherDbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get messages between the two users
    const allMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        senderFirstName: users.firstName,
        senderLastName: users.lastName,
        senderImageUrl: users.imageUrl,
        senderClerkId: users.clerkId
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          and(
            eq(messages.senderId, currentDbUser.id),
            eq(messages.receiverId, otherDbUser.id)
          ),
          and(
            eq(messages.senderId, otherDbUser.id),
            eq(messages.receiverId, currentDbUser.id)
          )
        )
      )
      .orderBy(messages.createdAt)

    // Format messages for the frontend
    const formattedMessages = allMessages.map(message => ({
      _id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.senderClerkId,
        name: `${message.senderFirstName || ''} ${message.senderLastName || ''}`.trim() || 'Anonymous',
        image: message.senderImageUrl || ''
      },
      receiver: {
        id: message.senderId === currentDbUser.id ? otherUserClerkId : userId,
        name: message.senderId === currentDbUser.id ? 
          `${otherDbUser.firstName || ''} ${otherDbUser.lastName || ''}`.trim() || 'Anonymous' :
          `${currentDbUser.firstName || ''} ${currentDbUser.lastName || ''}`.trim() || 'Anonymous',
        image: message.senderId === currentDbUser.id ? otherDbUser.imageUrl || '' : currentDbUser.imageUrl || ''
      }
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error('GET /api/messages - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get or create database user
    let [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (!dbUser) {
      // Create user if not found
      [dbUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || '',
          coverImageUrl: '',
          bio: '',
          socialLinks: {},
          metadata: {}
        })
        .returning()
    }

    const body = await request.json()
    const { content, receiverId } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID is required' },
        { status: 400 }
      )
    }

    // Get receiver's database ID
    const [receiverDbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, receiverId))
      .limit(1)

    if (!receiverDbUser) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Create new message
    const [newMessage] = await db
      .insert(messages)
      .values({
        content,
        senderId: dbUser.id,
        receiverId: receiverDbUser.id
      })
      .returning()

    // Format response
    const messageWithUsers = {
      _id: newMessage.id,
      content: newMessage.content,
      createdAt: newMessage.createdAt.toISOString(),
      sender: {
        id: userId,
        name: `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || 'Anonymous',
        image: dbUser.imageUrl || ''
      },
      receiver: {
        id: receiverId,
        name: `${receiverDbUser.firstName || ''} ${receiverDbUser.lastName || ''}`.trim() || 'Anonymous',
        image: receiverDbUser.imageUrl || ''
      }
    }

    return NextResponse.json(messageWithUsers)
  } catch (error) {
    console.error('POST /api/messages - Error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 