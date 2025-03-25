const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    const result = await client.query('SELECT id, title, level FROM courses');
    
    console.log('Courses:');
    result.rows.forEach(row => {
      console.log(`- ${row.id}: ${row.title} (${row.level})`);
    });
    
    // Check course details including module count
    for (const course of result.rows) {
      const moduleResult = await client.query('SELECT modules FROM courses WHERE id = $1', [course.id]);
      const moduleCount = Array.isArray(moduleResult.rows[0].modules) ? moduleResult.rows[0].modules.length : 0;
      console.log(`  Course "${course.title}" has ${moduleCount} modules`);
    }
    
    console.log(`Total: ${result.rows.length} courses`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 