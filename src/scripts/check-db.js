const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');

async function checkDatabase() {
  const client = postgres('postgresql://postgres:Abida1966@localhost:5432/komodoo', { max: 1 });
  const db = drizzle(client);

  try {
    // Check users table
    const users = await db.execute('SELECT * FROM users');
    console.log('Users:', users);

    // Check messages table
    const messages = await db.execute('SELECT * FROM messages');
    console.log('Messages:', messages);
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await client.end();
  }
}

checkDatabase(); 