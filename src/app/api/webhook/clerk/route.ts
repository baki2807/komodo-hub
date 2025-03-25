import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Get the webhook signature from the header
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no svix headers, the request is not from Clerk
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get the webhook secret from environment variables
  const secret = process.env.CLERK_WEBHOOK_SECRET as string;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret
  const wh = new Webhook(secret);

  let evt: WebhookEvent;

  try {
    // Verify the webhook signature
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook signature', { status: 400 });
  }

  // Handle the webhook event based on type
  const eventType = evt.type;
  console.log(`Received webhook event: ${eventType}`);

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      if (!id) {
        return new Response('Missing user ID in webhook data', { status: 400 });
      }
      
      // Get primary email
      const primaryEmail = email_addresses?.[0]?.email_address || 'unknown@example.com';
      
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
          imageUrl: image_url as string || '',
        });
        console.log(`Created new user: ${id}`);
      } else {
        // Update existing user
        await db
          .update(users)
          .set({
            email: primaryEmail,
            firstName: first_name as string || '',
            lastName: last_name as string || '',
            imageUrl: image_url as string || '',
            updatedAt: new Date()
          })
          .where(eq(users.clerkId, id as string));
        console.log(`Updated user: ${id}`);
      }
    }
    
    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      if (!id) {
        return new Response('Missing user ID in webhook data', { status: 400 });
      }
      
      // We could either delete the user or just mark them as deleted
      // For this example, we'll just mark the user record but keep their data
      // Adjust based on your data retention policies
      
      await db
        .update(users)
        .set({
          updatedAt: new Date(),
          // You could add a 'deleted' field to your schema if needed
        })
        .where(eq(users.clerkId, id as string));
      
      console.log(`Marked user as deleted: ${id}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
} 