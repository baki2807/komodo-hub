const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Get the current course data
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
    
    // Module content to update
    const moduleUpdates = [
      {
        title: "Conservation Challenges in Indonesia",
        content: `# Conservation Challenges in Indonesia

## Deforestation & Land Use Change
- **Scale**: Indonesia lost 9.5 million hectares of primary forest between 2001-2019
- **Primary Drivers**: 
  - Palm oil plantations (16.8M hectares dedicated to production)
  - Pulp and paper industry
  - Mining operations (coal, nickel, gold)
  - Infrastructure development
- **Impacts**: Habitat fragmentation, species decline, increased human-wildlife conflict

## Climate Change Vulnerabilities
- Rising sea levels threaten 42 million Indonesians in coastal communities
- Coral bleaching affects 35% of reef systems
- Changing precipitation patterns disrupt seasonal cycles critical for wildlife
- Increased frequency of extreme weather events (floods, droughts)

## Illegal Wildlife Trade
- Estimated annual value: USD $1 billion+
- Major trafficking hub connecting Asia with international markets
- Heavily trafficked species: pangolins, tigers, birds, reptiles, marine products
- Online trade platforms increasingly facilitate illegal transactions

## Marine Conservation Issues
- Overfishing depleting fish stocks by estimated 30-40% in major fishing grounds
- Destructive fishing practices (blast fishing, cyanide) damage reef ecosystems
- Marine plastic pollution (Indonesia is world's 2nd largest marine plastic polluter)
- Coastal development destroying critical nursery habitats

## Governance Challenges
- Decentralization creating policy implementation gaps between national and local levels
- Overlapping land claims and unclear tenure systems
- Limited enforcement capacity across vast archipelago
- Corruption undermining conservation efforts

## Resource Constraints
- Insufficient funding (conservation receives <1% of national budget)
- Limited trained personnel for protected area management
- Inadequate monitoring technology and infrastructure
- Research gaps in many ecosystems and species

## Population Pressures
- 270+ million people with 1.1% annual growth rate
- High poverty rates in rural areas (9.8% nationally)
- Economic development prioritized over conservation
- Limited alternative livelihood options in biodiversity-rich regions`
      },
      {
        title: "Indigenous Conservation Practices",
        content: `# Indigenous Conservation Practices

## Indigenous Communities of Indonesia
- **Diversity**: 1,300+ ethnic groups with distinct cultural traditions
- **Population**: Approximately 50-70 million indigenous people (Masyarakat Adat)
- **Distribution**: Present across all major islands and ecosystems
- **Legal Status**: Recognized under Constitutional Court Ruling No. 35/2012

## Traditional Ecological Knowledge Systems

### Sasi (Eastern Indonesia)
- **Description**: Temporal harvest restrictions managed by community leaders
- **Application**: Marine resources (fish, shellfish), forest products, fruit trees
- **Governance**: Traditional councils determine open/closed seasons
- **Benefits**: Prevents overharvesting, maintains ecosystem productivity
- **Examples**: Sasi Laut (marine), Sasi Hutan (forest) in Maluku and Papua

### Subak (Bali)
- **Description**: UNESCO-recognized irrigation system integrating religion and ecology
- **Application**: Rice cultivation through water temples and canals
- **Governance**: Community-managed cooperative irrigation schedules
- **Benefits**: Sustainable water use, pest management, biodiversity conservation
- **Ecological Impact**: Creates habitat mosaics supporting 100+ bird species

### Awig-Awig (Lombok)
- **Description**: Community-based regulations limiting resource extraction
- **Application**: Coastal and marine resource management
- **Governance**: Community councils determine and enforce rules
- **Benefits**: Coral reef protection, sustainable fisheries management

## Sacred Natural Sites

### Tana Ulen (Dayak Communities)
- **Description**: Protected forest areas with limited harvest rights
- **Location**: Kalimantan (Borneo)
- **Governance**: Tribal councils determine permissible activities
- **Benefits**: Watershed protection, wildlife conservation, medicinal plant preservation

### Hutan Larangan (Sumatra)
- **Description**: Sacred forests with taboos against harvesting/clearing
- **Governance**: Traditional elders and religious leaders
- **Benefits**: Habitat protection for threatened species, ecosystem connectivity

## Key Conservation Principles

### Spatial Management Systems
- Zonation designating areas for different use intensities
- Rotational harvest areas allowing ecosystem recovery
- Buffer zones protecting critical habitats
- Territorial boundaries respected through traditional markers

### Temporal Management Practices
- Seasonal harvest restrictions aligned with species life cycles
- Prohibition periods allowing resource regeneration
- Ceremonial calendars coordinating sustainable extraction

### Modern Integration Challenges
- Recognition gaps in national policy frameworks
- Knowledge loss among younger generations
- Economic pressures undermining traditional systems
- Climate change disrupting traditional ecological indicators`
      },
      {
        title: "Current Conservation Initiatives",
        content: `# Current Conservation Initiatives

## Government-Led Programs

### National Biodiversity Strategy and Action Plan (NBSAP)
- **Timeframe**: 2015-2020, extended through 2025
- **Focus**: Implementing CBD commitments across 22 action plans
- **Key Targets**: 
  - Reducing deforestation by 60% from 2021-2025
  - Rehabilitating 12 million hectares of critical ecosystems
  - Protecting 8% of coastal and marine areas

### Forest Moratorium Policy
- **Established**: 2011, made permanent in 2019
- **Coverage**: 66.2 million hectares of primary forests and peatlands
- **Mechanism**: Prohibits new concessions for palm oil, timber, mining
- **Implementation**: One Map Policy integrating land use planning

### Essential Ecosystem Areas (KEE)
- **Description**: Conservation areas outside protected network
- **Coverage**: 12.1 million hectares designated
- **Management**: Public-private partnerships
- **Focus**: High-value conservation forests, wildlife corridors, urban watersheds

## International Partnerships

### Tropical Forest Conservation Act (TFCA)
- **Partners**: Indonesia-US debt-for-nature swap
- **Investment**: $41.5 million for forest conservation
- **Projects**: 80+ community conservation initiatives
- **Focus Areas**: Sumatra, Kalimantan, Sulawesi, Java

### Green Climate Fund Projects
- **REDD+ Results-Based Payments**: $103.8 million (2020)
- **Mangrove Restoration**: $13.1 million across 5 provinces
- **Climate Resilience**: $9.9 million for adaptive agriculture in Papua

### Blue Carbon Initiatives
- **Partners**: Indonesia, UNEP, GEF, Norway
- **Focus**: Mangrove restoration and conservation
- **Scale**: 600,000 hectares targeted for restoration by 2024
- **Mechanism**: Carbon offset markets funding protection efforts

## NGO and Community Initiatives

### Collaborative Management Models
- **Examples**: Gunung Leuser, Ujung Kulon, Bogani Nani Wartabone National Parks
- **Approach**: Multi-stakeholder governance involving communities, government, NGOs
- **Activities**: Joint patrols, benefit-sharing, sustainable use zones

### Sustainable Commodity Certification
- **RSPO** (Roundtable on Sustainable Palm Oil): 2.9 million hectares certified
- **FSC** (Forest Stewardship Council): 3.7 million hectares certified
- **MSC** (Marine Stewardship Council): 6 fisheries certified

### Species Recovery Programs
- **Sumatran Rhino Sanctuary**: Ex-situ breeding facilities in Way Kambas
- **Orangutan Rehabilitation**: 6 major centers across Sumatra and Kalimantan
- **Marine Turtle Conservation**: Community-based nesting beach protection

## Innovative Approaches

### Ecological Fiscal Transfers
- **Mechanism**: Revenue sharing based on ecological indicators
- **Scale**: $127 million distributed to provinces based on forest cover (2019)
- **Impact**: Creating financial incentives for local governments to maintain forests

### Technology Applications
- **SMART Patrols**: GPS-based enforcement in 45 protected areas
- **eDNA Monitoring**: Aquatic biodiversity surveys in 12 major watersheds
- **Satellite Monitoring**: Near real-time deforestation alerts through Global Forest Watch`
      }
    ];
    
    // Update each module
    for (const update of moduleUpdates) {
      const moduleIndex = modules.findIndex(module => module.title === update.title);
      
      if (moduleIndex === -1) {
        console.error(`Module not found: ${update.title}`);
        continue;
      }
      
      console.log(`Updating module: ${update.title}`);
      modules[moduleIndex].content = update.content;
    }
    
    // Convert the modules to a proper JSON string
    const modulesJson = JSON.stringify(modules);
    
    // Update the course in the database
    await client.query(
      'UPDATE courses SET modules = $1::jsonb WHERE id = $2',
      [modulesJson, courseId]
    );
    
    console.log('All modules updated successfully');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 