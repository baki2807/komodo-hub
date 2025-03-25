import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function GET() {
  try {
    // Test database connection
    const result = await db
      .select({ count: users.id })
      .from(users);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount: result.length
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 