const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    const result = await client.query(
      'SELECT modules FROM courses WHERE title = $1',
      ['Introduction to Indonesian Wildlife']
    );
    
    if (result.rows.length === 0) {
      console.error('Course not found');
      return;
    }
    
    const modules = result.rows[0].modules;
    console.log(`Found ${modules.length} modules:`);
    
    // Check each module
    for (const module of modules) {
      console.log(`\n============================================`);
      console.log(`Module: ${module.title}`);
      console.log(`Content length: ${module.content.length} characters`);
      
      // Print the first few lines of content
      const contentPreview = module.content.split('\n').slice(0, 5).join('\n');
      console.log(`\nContent preview:\n${contentPreview}...\n`);
      
      // Extract and print all headings to verify structure
      const headings = module.content.match(/^## .+$/gm) || [];
      if (headings.length > 0) {
        console.log('Main sections:');
        headings.forEach(heading => console.log(`- ${heading}`));
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('\nDisconnected from database');
  }
}

run(); 