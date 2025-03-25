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

    // Get all users from the database
    const allUsers = await db.select().from(users)

    // Check if current user exists in DB
    const currentUserExists = allUsers.some(user => user.clerkId === userId)
    
    // If the authenticated user doesn't exist in the database, create them
    if (!currentUserExists) {
      try {
        // Get current user details from Clerk if possible
        let firstName = "";
        let lastName = "";
        let email = "pending@example.com";
        let imageUrl = "";
        
        // Try to get user details from Clerk
        try {
          const user = await currentUser();
          if (user) {
            firstName = user.firstName || "";
            lastName = user.lastName || "";
            email = user.emailAddresses[0]?.emailAddress || email;
            imageUrl = user.imageUrl || "";
          }
        } catch (clerkError) {
          console.error("Error fetching Clerk user:", clerkError);
        }
        
        // If no image URL, generate one from UI Avatars
        if (!imageUrl) {
          imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${firstName || "U"} ${lastName || ""}`.trim()
          )}&background=random`;
        }
        
        // Create a basic user record with just the clerkId
        // The webhook will eventually update with full details
        await db.insert(users).values({
          clerkId: userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          imageUrl: imageUrl,
        })
        
        console.log(`Created new user on demand: ${userId}`)
        
        // Fetch users again to include the newly created user
        return NextResponse.json(await db.select().from(users))
      } catch (error) {
        console.error("Error creating user on demand:", error)
      }
    }

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 