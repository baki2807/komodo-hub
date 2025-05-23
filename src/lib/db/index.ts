// @ts-ignore
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Safely access environment variables
let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  // Fallback to hardcoded connection string if environment variable isn't loaded
  connectionString = 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  console.log('Using fallback database connection string')
}

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production'

function logError(error: unknown, context: string) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const errorDetails = error instanceof Error ? error.stack : String(error)
  console.error(`PostgreSQL ${context}:`, {
    message: errorMessage,
    details: errorDetails,
    timestamp: new Date().toISOString()
  })
}

// Connection for queries with proper type handling and connection pooling
const queryClient = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Max idle time in seconds
  connect_timeout: 10, // Connection timeout in seconds
  max_lifetime: 60 * 30, // Max connection lifetime in seconds (30 minutes)
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  types: {
    uuid: {
      to: 36,
      from: [2950, 2951], // UUID types
      serialize: (val: string) => val,
      parse: (val: string) => val,
    },
  },
  onnotice: (notice: unknown) => {
    console.log('PostgreSQL notice:', notice)
  },
  onparameter: (parameter: unknown) => {
    console.log('PostgreSQL parameter:', parameter)
  },
  onclose: () => {
    console.log('PostgreSQL connection closed')
  }
})

// Test the connection
try {
  await queryClient`SELECT 1`
  console.log('Successfully connected to PostgreSQL')
} catch (error) {
  logError(error, 'initial connection test failed')
  throw new Error('Failed to connect to PostgreSQL database')
}

export const db = drizzle(queryClient, { schema }) 