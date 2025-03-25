import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

async function testConnection() {
  // Connect to postgres
  const client = postgres('postgresql://postgres:Abida1966@localhost:5432/komodoo', { max: 1 })
  const db = drizzle(client)
  
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const result = await db.execute(sql`SELECT 1 as connection_test`)
    console.log('Connection test result:', result)
    
    // Test table existence
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as table_exists
    `)
    console.log('Table check result:', tableCheck)
    
    // Test table structure
    const columnCheck = await db.execute(sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
    `)
    console.log('Column check result:', columnCheck)
    
    console.log('All tests completed successfully!')
  } catch (error) {
    console.error('Database test error:', error)
  } finally {
    await client.end()
  }
}

testConnection() 