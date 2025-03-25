import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

async function resetDatabase() {
  // Connect to postgres to drop and recreate the database
  const rootClient = postgres('postgresql://postgres:Abida1966@localhost:5432/postgres', { max: 1 })
  
  try {
    // Drop the database if it exists
    await rootClient.unsafe(`DROP DATABASE IF EXISTS komodo`)
    console.log('Dropped existing database')
    
    // Create a new database
    await rootClient.unsafe(`CREATE DATABASE komodo`)
    console.log('Created new database')
    
    // Close the root connection
    await rootClient.end()
    
    // Connect to the new database
    const client = postgres('postgresql://postgres:Abida1966@localhost:5432/komodo', { max: 1 })
    const db = drizzle(client)
    
    // Run migrations
    await migrate(db, { migrationsFolder: './src/lib/db/migrations' })
    console.log('Applied schema migrations')
    
    // Close the connection
    await client.end()
    
    console.log('Database reset completed successfully')
  } catch (error) {
    console.error('Error resetting database:', error)
    process.exit(1)
  }
}

// Run the reset function
resetDatabase() 