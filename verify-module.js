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
    const targetModule = modules.find(m => m.title === "Indonesia's Biodiversity Hotspots");
    
    if (!targetModule) {
      console.error('Module not found');
      return;
    }
    
    console.log('Module title:', targetModule.title);
    console.log('Content preview:');
    console.log('--------------------------------------------------');
    console.log(targetModule.content.substring(0, 300) + '...');
    console.log('--------------------------------------------------');
    console.log('Content length:', targetModule.content.length, 'characters');
    
    // Print all section headings to verify structure
    console.log('\nContent structure:');
    console.log('--------------------------------------------------');
    const content = targetModule.content;
    const headings = content.match(/^## .+$/gm) || [];
    headings.forEach(heading => console.log(heading));
    
    // Check for specific sections
    console.log('\nVerifying key sections:');
    const keySections = [
      'Introduction',
      'Key Biodiversity Hotspots',
      'Marine Biodiversity',
      'Why Indonesia Matters',
      'Current Status'
    ];
    
    for (const section of keySections) {
      const found = content.includes(`## ${section}`);
      console.log(`- ${section}: ${found ? '✓ Found' : '✗ Missing'}`);
    }
    
    // Check for key biodiversity regions
    console.log('\nVerifying biodiversity regions:');
    const regions = [
      'Sundaland (Western Indonesia)',
      'Wallacea (Central Indonesia)',
      'Papua (Eastern Indonesia)'
    ];
    
    for (const region of regions) {
      const found = content.includes(`### ${region}`);
      console.log(`- ${region}: ${found ? '✓ Found' : '✗ Missing'}`);
    }
    
    // Additional verification of specific content elements
    console.log('\nVerifying content elements:');
    const contentElements = [
      'Coral Triangle',
      'Wallace and Weber lines',
      'endemic species',
      'Sumatran tiger',
      'UNESCO',
      'Komodo dragon'
    ];
    
    for (const element of contentElements) {
      const found = content.includes(element);
      console.log(`- "${element}": ${found ? '✓ Found' : '✗ Missing'}`);
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 