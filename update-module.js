const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // First, get the current course data
    const courseResult = await client.query(
      'SELECT id, modules FROM courses WHERE title = $1',
      ['Introduction to Indonesian Wildlife']
    );
    
    if (courseResult.rows.length === 0) {
      console.error('Course not found');
      return;
    }
    
    const courseId = courseResult.rows[0].id;
    console.log('Course ID:', courseId);
    
    // Get the existing modules
    let modules = courseResult.rows[0].modules;
    console.log('Found', modules.length, 'modules');
    
    // Find the module to update
    const moduleIndex = modules.findIndex(module => module.title === "Indonesia's Biodiversity Hotspots");
    
    if (moduleIndex === -1) {
      console.error('Module not found');
      return;
    }
    
    console.log('Found module at index:', moduleIndex);
    
    // New content for the module
    const newContent = `# Indonesia's Biodiversity Hotspots

## Introduction
Indonesia spans 17,000+ islands across the Wallace and Weber lines, creating one of Earth's richest biodiversity regions where Asian and Australian species converge.

## Key Biodiversity Hotspots

### Sundaland (Western Indonesia)
- **Location**: Sumatra, Java, Borneo (Kalimantan), and surrounding islands
- **Ecosystems**: Tropical rainforests, peat swamps, mangroves
- **Notable Species**: Orangutan, Sumatran tiger, Javan rhinoceros, proboscis monkey
- **Endemism**: Over 15,000 endemic plant species; 701 endemic vertebrates

### Wallacea (Central Indonesia)
- **Location**: Sulawesi, Maluku, Lesser Sunda Islands
- **Ecosystems**: Dry forests, monsoon forests, coral reefs
- **Notable Species**: Babirusa, anoa, maleo, Komodo dragon
- **Endemism**: High marine and terrestrial endemism due to isolation

### Papua (Eastern Indonesia)
- **Location**: Western half of New Guinea island
- **Ecosystems**: Montane forests, lowland rainforests, alpine grasslands
- **Notable Species**: Birds of paradise, tree kangaroos, echidnas
- **Endemism**: Contains approximately 50% of New Guinea's 13,634 plant species

## Marine Biodiversity
- Located within the Coral Triangle, the global epicenter of marine biodiversity
- Houses 76% of the world's coral species and 37% of reef fish species
- Key areas: Raja Ampat, Wakatobi, Bunaken, Derawan Islands
- Critical habitats for 6 of 7 marine turtle species, dugongs, and whale sharks

## Why Indonesia Matters
- Contains approximately 17% of the world's species on just 1.3% of Earth's land surface
- Second highest number of endemic species globally
- Hosts 10% of known plant species, 12% of mammals, 17% of birds
- Key ecosystems provide critical ecosystem services for 270+ million Indonesians

## Current Status
- 36 UNESCO Biosphere Reserves and National Parks
- 68 Important Bird Areas
- 18 World Heritage Sites (natural and mixed)
- High rates of habitat loss and fragmentation continue to threaten biodiversity`;
    
    // Update the module content
    modules[moduleIndex].content = newContent;
    
    // Convert the modules to a proper JSON string
    const modulesJson = JSON.stringify(modules);
    
    // Update the course in the database using JSON syntax
    await client.query(
      'UPDATE courses SET modules = $1::jsonb WHERE id = $2',
      [modulesJson, courseId]
    );
    
    console.log('Module updated successfully');
    console.log(`Updated module: ${modules[moduleIndex].title}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 