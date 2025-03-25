import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

// Create a new connection for migrations
const migrationClient = postgres('postgresql://postgres:Abida1966@localhost:5432/komodo', { max: 1 })
const db = drizzle(migrationClient)

async function runMigration() {
  try {
    // Add social_links column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
    `)
    
    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await migrationClient.end()
  }
}

runMigration() 