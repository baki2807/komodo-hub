import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      // Try to get the user from the database
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1)

      if (dbUser && dbUser.length > 0) {
        return NextResponse.json(dbUser[0])
      }

      // If no user exists, create a new one with clerk data
      const clerkUser = await currentUser();
      const firstName = clerkUser?.firstName || '';
      const lastName = clerkUser?.lastName || '';
      const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
      const imageUrl = clerkUser?.imageUrl || null;

      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          imageUrl: imageUrl,
          coverImageUrl: '',
          bio: '',
          socialLinks: {},
          metadata: {}
        })
        .returning()
      
      return NextResponse.json(newUser)
    } catch (dbError) {
      console.error('Database error in profile API:', dbError)
      
      // Return a placeholder profile if database fails
      return NextResponse.json({
        id: 'temp-id',
        clerkId: userId,
        email: 'user@example.com',
        firstName: '',
        lastName: '',
        imageUrl: null,
        coverImageUrl: null,
        bio: '',
        socialLinks: {},
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error in profile API:', error)
    
    // Return a 200 OK with placeholder data instead of 500
    return NextResponse.json({
      id: 'error-id',
      clerkId: 'unknown',
      email: 'error@example.com',
      firstName: '',
      lastName: '',
      imageUrl: null,
      coverImageUrl: null,
      bio: '',
      socialLinks: {},
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let clerkData = {
      firstName: '',
      lastName: '',
      email: '',
      imageUrl: null as string | null
    };
    
    try {
      // Try to get clerk user, but continue even if it fails
      const clerkUser = await currentUser()
      if (clerkUser) {
        clerkData = {
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          imageUrl: clerkUser.imageUrl
        }
      }
    } catch (clerkError) {
      console.error('Clerk error in profile API:', clerkError)
      // Continue without Clerk data
    }

    const body = await request.json()

    // First check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    try {
      let user
      if (!existingUser || existingUser.length === 0) {
        // Create new user
        const result = await db
          .insert(users)
          .values({
            clerkId: userId,
            email: body.email || clerkData.email,
            firstName: body.firstName || clerkData.firstName,
            lastName: body.lastName || clerkData.lastName,
            imageUrl: body.imageUrl || clerkData.imageUrl,
            coverImageUrl: body.coverImageUrl || '',
            bio: body.bio || '',
            socialLinks: body.socialLinks || {},
            metadata: body.metadata || {}
          })
          .returning()
        user = result[0]
      } else {
        // Update existing user
        const result = await db
          .update(users)
          .set({
            email: body.email || existingUser[0].email,
            firstName: body.firstName !== undefined ? body.firstName : existingUser[0].firstName,
            lastName: body.lastName !== undefined ? body.lastName : existingUser[0].lastName,
            imageUrl: body.imageUrl !== undefined ? body.imageUrl : existingUser[0].imageUrl,
            coverImageUrl: body.coverImageUrl !== undefined ? body.coverImageUrl : existingUser[0].coverImageUrl,
            bio: body.bio !== undefined ? body.bio : existingUser[0].bio,
            socialLinks: body.socialLinks || existingUser[0].socialLinks,
            metadata: body.metadata || existingUser[0].metadata
          })
          .where(eq(users.clerkId, userId))
          .returning()
        user = result[0]
      }

      return NextResponse.json(user)
    } catch (dbError) {
      console.error('Database operation error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in PUT /api/profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 