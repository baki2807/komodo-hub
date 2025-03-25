import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Test 1: Basic connection
    const connectionTest = await db.execute(sql`SELECT 1 as connection_test`)
    
    // Test 2: Check if users table exists
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as table_exists
    `)
    
    // Test 3: Check table structure
    const columnCheck = await db.execute(sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
    `)

    // Test 4: Try to insert a test user
    const testUser = await db
      .insert(users)
      .values({
        clerkId: 'test-clerk-id-' + Date.now(),
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio'
      })
      .returning()
      .catch(err => ({
        error: err instanceof Error ? err.message : 'Insert failed'
      }))

    return NextResponse.json({
      success: true,
      tests: {
        connection: connectionTest,
        tableExists: tableCheck,
        tableStructure: columnCheck,
        userInsert: testUser
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorObject: error
    }, { status: 500 })
  }
} 