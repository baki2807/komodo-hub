const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    const modules = JSON.stringify([
      {
        id: "3",
        title: "Komodo Dragon Biology & Behavior",
        content: "Study the unique biology, hunting strategies, and social behavior of Varanus komodoensis.",
        order: 1
      },
      {
        id: "4",
        title: "Komodo National Park Ecosystem",
        content: "Explore the terrestrial and marine ecosystems that make up the habitat of the Komodo dragon.",
        order: 2
      }
    ]);
    
    const result = await client.query(
      'INSERT INTO courses(title, description, image_url, level, modules) VALUES($1, $2, $3, $4, $5) RETURNING id',
      [
        'Komodo Dragon Ecology & Conservation',
        'An in-depth exploration of the world\'s largest lizard, its unique ecosystem, and ongoing conservation efforts.',
        '/images/courses/komodo-ecology.jpg',
        'Intermediate',
        modules
      ]
    );
    
    console.log('Inserted course with ID:', result.rows[0].id);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 