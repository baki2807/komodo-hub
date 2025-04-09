import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

const connectionString = 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'

const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }
})

const db = drizzle(client)

async function clearPosts() {
  try {
    console.log('Clearing all posts from the database...')
    await db.execute(sql`DELETE FROM posts`)
    console.log('Successfully cleared all posts!')
  } catch (error) {
    console.error('Error clearing posts:', error)
    process.exit(1)
  } finally {
    await client.end()
    process.exit(0)
  }
}

clearPosts() 