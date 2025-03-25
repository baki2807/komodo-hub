require('dotenv').config();

const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');

async function resetDatabase() {
    const rootUrl = process.env.DATABASE_URL?.replace(/\/[^/]+$/, '/postgres');
    if (!rootUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    const rootClient = postgres(rootUrl, { max: 1 });
    try {
        // Force close all connections to the database
        await rootClient.unsafe(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'komodoo'
            AND pid <> pg_backend_pid();
        `);
        console.log('Closed all existing connections');
        
        // Drop the database if it exists
        await rootClient.unsafe(`DROP DATABASE IF EXISTS komodoo`);
        console.log('Dropped existing database');
        
        // Create a new database
        await rootClient.unsafe(`CREATE DATABASE komodoo`);
        console.log('Created new database');
        
        // Close the root connection
        await rootClient.end();
        
        // Connect to the new database
        const client = postgres(process.env.DATABASE_URL, { max: 1 });
        const db = drizzle(client);
        
        // Run migrations
        await migrate(db, { migrationsFolder: './src/lib/db/migrations' });
        console.log('Applied schema migrations');
        
        // Close the connection
        await client.end();
        console.log('Database reset completed successfully');
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase(); 