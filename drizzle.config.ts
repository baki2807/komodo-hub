import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Abida1966',
    database: 'komodoo',
    ssl: false
  }
} satisfies Config; 