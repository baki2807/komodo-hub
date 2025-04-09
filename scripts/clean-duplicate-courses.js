const { Client } = require('pg')

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Find duplicate courses based on title
    const duplicateResult = await client.query(`
      SELECT title, COUNT(*) as count, array_agg(id) as course_ids
      FROM courses
      GROUP BY title
      HAVING COUNT(*) > 1
    `)

    if (duplicateResult.rows.length === 0) {
      console.log('No duplicate courses found')
      return
    }

    console.log(`Found ${duplicateResult.rows.length} duplicate course titles`)

    // For each set of duplicates, keep the first one and mark others for deletion
    const coursesToDelete = []
    
    for (const row of duplicateResult.rows) {
      console.log(`\nProcessing duplicates for: ${row.title}`)
      console.log(`Found ${row.count} duplicates`)
      
      // Keep the first course ID, mark others for deletion
      const [keepId, ...deleteIds] = row.course_ids
      console.log(`Keeping course ID: ${keepId}`)
      console.log(`Marking for deletion: ${deleteIds.join(', ')}`)
      
      coursesToDelete.push(...deleteIds)
    }
    
    // Delete the duplicate courses
    if (coursesToDelete.length > 0) {
      console.log(`\nDeleting ${coursesToDelete.length} duplicate courses...`)
      
      // First check if there are user_progress entries for any of these courses
      const progressResult = await client.query(
        'SELECT course_id, COUNT(*) FROM user_progress WHERE course_id = ANY($1) GROUP BY course_id',
        [coursesToDelete]
      )
      
      if (progressResult.rows.length > 0) {
        console.log('Warning: Found user_progress entries for courses to be deleted:')
        progressResult.rows.forEach(row => {
          console.log(`- Course ID ${row.course_id}: ${row.count} progress entries`)
        })
        
        // Delete these entries first
        console.log('Deleting related user_progress entries...')
        await client.query(
          'DELETE FROM user_progress WHERE course_id = ANY($1)',
          [coursesToDelete]
        )
      }
      
      // Now delete the courses
      const deleteResult = await client.query(
        'DELETE FROM courses WHERE id = ANY($1) RETURNING id',
        [coursesToDelete]
      )
      
      console.log(`Successfully deleted ${deleteResult.rows.length} duplicate courses`)
    } else {
      console.log('No duplicate courses to delete')
    }
    
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.end()
    console.log('Disconnected from database')
  }
}

run() 