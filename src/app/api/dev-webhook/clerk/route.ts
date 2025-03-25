import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * This endpoint simulates Clerk webhook events for local development
 * It should NOT be used in production
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('This endpoint is only for development', { status: 403 });
  }

  try {
    const { eventType, data } = await req.json();

    if (!eventType || !data) {
      return new NextResponse('Missing event type or data', { status: 400 });
    }

    console.log(`Processing development webhook: ${eventType}`);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      
      if (!id) {
        return new NextResponse('Missing user ID', { status: 400 });
      }
      
      // Get primary email
      const primaryEmail = email_addresses?.[0]?.email_address || 'dev@example.com';
      
      // Ensure we have a valid image URL - use a placeholder if none provided
      const imageUrl = image_url && typeof image_url === 'string' && image_url.trim() !== '' 
        ? image_url 
        : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${first_name || ''} ${last_name || ''}`);
      
      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, id as string))
        .limit(1);
      
      if (existingUser.length === 0) {
        // Create new user record
        await db.insert(users).values({
          clerkId: id as string,
          email: primaryEmail,
          firstName: first_name as string || '',
          lastName: last_name as string || '',
          imageUrl: imageUrl,
        });
        console.log(`Created new user: ${id}`);
        return NextResponse.json({ success: true, action: 'created' });
      } else {
        // Update existing user
        await db
          .update(users)
          .set({
            email: primaryEmail,
            firstName: first_name as string || '',
            lastName: last_name as string || '',
            imageUrl: imageUrl,
            updatedAt: new Date()
          })
          .where(eq(users.clerkId, id as string));
        console.log(`Updated user: ${id}`);
        return NextResponse.json({ success: true, action: 'updated' });
      }
    }
    
    if (eventType === 'user.deleted') {
      const { id } = data;
      
      if (!id) {
        return new NextResponse('Missing user ID', { status: 400 });
      }
      
      await db
        .update(users)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id as string));
      
      console.log(`Marked user as deleted: ${id}`);
      return NextResponse.json({ success: true, action: 'deleted' });
    }
    
    return NextResponse.json({ success: false, error: 'Unsupported event type' });
  } catch (error) {
    console.error('Error processing development webhook:', error);
    return new NextResponse('Error processing development webhook', { status: 500 });
  }
} 