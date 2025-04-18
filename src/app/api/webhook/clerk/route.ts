import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// Type guard for user events
function isUserEvent(evt: WebhookEvent): evt is WebhookEvent & { data: { id: string, email_addresses?: Array<{ email_address: string }>, first_name?: string, last_name?: string, image_url?: string } } {
  return evt.type.startsWith('user.');
}

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new Response('Missing svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Get the webhook secret from environment variables
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!CLERK_WEBHOOK_SECRET) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return new Response('Missing webhook secret', { status: 500 });
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error verifying webhook', { status: 400 });
    }

    // Get the type
    const { type } = evt;

    // Validate that this is a user event
    if (!isUserEvent(evt)) {
      console.error('Invalid event type:', type);
      return new Response('Invalid event type', { status: 400 });
    }

    const eventData = evt.data;

    try {
      switch (type) {
        case 'user.created': {
          // Validate required fields for user creation
          if (!eventData.email_addresses?.[0]?.email_address) {
            throw new Error('Missing email address in user data');
          }

          const newUser = {
            clerkId: eventData.id,
            email: eventData.email_addresses[0].email_address,
            firstName: eventData.first_name || '',
            lastName: eventData.last_name || '',
            imageUrl: eventData.image_url || '',
          };

          await db.insert(users).values(newUser);
          break;
        }
        case 'user.updated': {
          const updateData = {
            firstName: eventData.first_name || '',
            lastName: eventData.last_name || '',
            imageUrl: eventData.image_url || '',
          };

          await db.update(users)
            .set(updateData)
            .where(eq(users.clerkId, eventData.id));
          break;
        }
        case 'user.deleted': {
          await db.delete(users)
            .where(eq(users.clerkId, eventData.id));
          break;
        }
        default: {
          console.log(`Unhandled webhook event type: ${type}`);
          return new Response(`Unhandled webhook event type: ${type}`, { status: 400 });
        }
      }

      return new Response('Webhook processed successfully', { status: 200 });
    } catch (error) {
      console.error('Database operation failed:', error);
      return new Response('Internal server error during database operation', { status: 500 });
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 