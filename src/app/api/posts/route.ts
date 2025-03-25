import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { posts, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    // Get all posts with author information
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        media: posts.media,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorFirstName: users.firstName,
        authorLastName: users.lastName,
        authorImageUrl: users.imageUrl,
        authorClerkId: users.clerkId
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))

    // Format posts for the frontend
    const formattedPosts = (allPosts || []).map(post => ({
      _id: post.id,
      title: post.title || 'Community Post',
      content: post.content || '',
      media: post.media || [],
      createdAt: post.createdAt.toISOString(),
      author: `${post.authorFirstName || ''} ${post.authorLastName || ''}`.trim() || 'Anonymous',
      authorImage: post.authorImageUrl || '',
      userId: post.authorClerkId
    }))

    return NextResponse.json(formattedPosts)
  } catch (error) {
    console.error('GET /api/posts - Error:', error)
    
    // Return empty array instead of error
    // This allows the UI to still render without posts
    return NextResponse.json([])
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

    let user;
    let dbUser;
    
    try {
      // Try to get Clerk user
      user = await currentUser();
      
      // Get or create database user
      dbUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1)

      if (!dbUser || dbUser.length === 0) {
        // Create user if not found
        const [newUser] = await db
          .insert(users)
          .values({
            clerkId: userId,
            email: user?.emailAddresses[0]?.emailAddress || 'user@example.com',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            imageUrl: user?.imageUrl || '',
            bio: '',
            metadata: {}
          })
          .returning()
        dbUser = [newUser]
      }
    } catch (userError) {
      console.error('Error getting user:', userError);
      return NextResponse.json(
        { error: 'Failed to get user data' },
        { status: 500 }
      )
    }

    try {
      const body = await request.json()
      const { title, content, media } = body

      if (!content && (!media || media.length === 0)) {
        return NextResponse.json(
          { error: 'Content or media is required' },
          { status: 400 }
        )
      }

      // Create new post
      const [newPost] = await db
        .insert(posts)
        .values({
          title: title || 'Community Post',
          content: content || '',
          authorId: dbUser[0].id,
          media: media || []
        })
        .returning()

      // Format response
      const postWithAuthor = {
        _id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        media: newPost.media || [],
        createdAt: newPost.createdAt.toISOString(),
        author: `${dbUser[0].firstName || ''} ${dbUser[0].lastName || ''}`.trim() || 'Anonymous',
        authorImage: dbUser[0].imageUrl || '',
        userId: userId
      }

      return NextResponse.json(postWithAuthor)
    } catch (postError) {
      console.error('Error creating post:', postError);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('POST /api/posts - Error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')
    if (!postId) {
      return NextResponse.json(
        { error: 'Missing post ID' },
        { status: 400 }
      )
    }

    // Get the user's database ID
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (!dbUser || dbUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Check if the post exists and belongs to the user
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1)

    if (!post || post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post[0].authorId !== dbUser[0].id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete the post
    await db
      .delete(posts)
      .where(eq(posts.id, postId))

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/posts - Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
} 