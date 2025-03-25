import { MongoClient, Db } from 'mongodb'

// Make sure we have a MongoDB URI
// @ts-ignore - process.env exists in Next.js
const uri = process.env.MONGODB_URI as string
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  if (!cachedClient) {
    cachedClient = await MongoClient.connect(uri)
  }

  // Use the database name from environment or default to 'komodo'
  // @ts-ignore - process.env exists in Next.js
  cachedDb = cachedClient.db(process.env.MONGODB_DB as string || 'komodo')
  return cachedDb
}

export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
} 