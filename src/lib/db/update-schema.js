const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgres://postgres:Abida1966@localhost:5432/komodo_db'
})

async function updateSchema() {
  try {
    await client.connect()
    
    // Add new columns
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
    `)

    // Copy data from full_name to first_name
    await client.query(`
      UPDATE users 
      SET first_name = full_name 
      WHERE first_name IS NULL;
    `)

    // Drop old column
    await client.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS full_name;
    `)

    console.log('Schema updated successfully')
  } catch (error) {
    console.error('Error updating schema:', error)
  } finally {
    await client.end()
  }
}

updateSchema() 