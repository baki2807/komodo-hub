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
    
    const content = targetModule.content;
    
    // Full content for reference (commented out to avoid cluttering the console)
    // console.log('\nFULL CONTENT:');
    // console.log('==================================================');
    // console.log(content);
    // console.log('==================================================');
    
    // Print all main headings
    console.log('\nMAIN SECTIONS:');
    const mainHeadings = content.match(/^## .+$/gm) || [];
    mainHeadings.forEach(heading => console.log(`- ${heading}`));
    
    // Print all sub-headings
    console.log('\nSUB-SECTIONS:');
    const subHeadings = content.match(/^### .+$/gm) || [];
    subHeadings.forEach(heading => console.log(`- ${heading}`));
    
    // Check for key regions
    console.log('\nKEY BIODIVERSITY REGIONS:');
    [
      'Sundaland',
      'Wallacea',
      'Papua'
    ].forEach(region => {
      console.log(`- ${region}: ${content.includes(region) ? '✓' : '✗'}`);
    });
    
    // Check for key species
    console.log('\nKEY SPECIES:');
    [
      'Orangutan',
      'Sumatran tiger',
      'Javan rhinoceros',
      'proboscis monkey',
      'Babirusa',
      'anoa',
      'maleo',
      'Komodo dragon',
      'Birds of paradise',
      'tree kangaroos',
      'echidnas'
    ].forEach(species => {
      console.log(`- ${species}: ${content.includes(species) ? '✓' : '✗'}`);
    });
    
    // Check for key facts
    console.log('\nKEY FACTS:');
    [
      '17,000+ islands',
      'Wallace and Weber lines',
      '15,000 endemic plant species',
      '701 endemic vertebrates',
      'Coral Triangle',
      '76% of the world\'s coral species',
      '37% of reef fish species',
      '17% of the world\'s species',
      '36 UNESCO Biosphere Reserves',
      '68 Important Bird Areas',
      '18 World Heritage Sites'
    ].forEach(fact => {
      console.log(`- "${fact}": ${content.includes(fact) ? '✓' : '✗'}`);
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 