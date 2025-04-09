import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Exists' : 'Missing',
    secretKey: process.env.CLERK_SECRET_KEY ? 'Exists' : 'Missing',
    // Don't include actual values for security
  });
} 