const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.ljfzequmcnhjjozdyagh:Abida1966.@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // First, fetch all courses
    const result = await client.query('SELECT id, title, modules FROM courses');
    console.log(`Found ${result.rows.length} courses in the database`);
    
    // Group courses by title
    const coursesByTitle = {};
    result.rows.forEach(course => {
      if (!coursesByTitle[course.title]) {
        coursesByTitle[course.title] = [];
      }
      coursesByTitle[course.title].push(course);
    });
    
    // Find duplicates (titles with more than one course)
    const duplicateTitles = Object.keys(coursesByTitle).filter(
      title => coursesByTitle[title].length > 1
    );
    
    console.log(`Found ${duplicateTitles.length} duplicate titles`);
    
    // For each set of duplicates, keep only the course with the most modules
    const coursesToDelete = [];
    
    for (const title of duplicateTitles) {
      const courses = coursesByTitle[title];
      console.log(`Processing duplicates for "${title}" (${courses.length} courses found)`);
      
      // Sort by number of modules (descending)
      courses.sort((a, b) => {
        const modulesA = Array.isArray(a.modules) ? a.modules.length : 0;
        const modulesB = Array.isArray(b.modules) ? b.modules.length : 0;
        return modulesB - modulesA;
      });
      
      // Keep the first one (most modules), delete the rest
      const keepCourse = courses[0];
      const moduleCount = Array.isArray(keepCourse.modules) ? keepCourse.modules.length : 0;
      console.log(`Keeping course ID ${keepCourse.id} with ${moduleCount} modules`);
      
      // Add the rest to delete list
      courses.slice(1).forEach(course => {
        const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;
        console.log(`Marking for deletion: course ID ${course.id} with ${moduleCount} modules`);
        coursesToDelete.push(course.id);
      });
    }
    
    // Delete the duplicate courses
    if (coursesToDelete.length > 0) {
      console.log(`Deleting ${coursesToDelete.length} duplicate courses...`);
      
      // First check if there are user_progress entries for any of these courses
      const progressResult = await client.query(
        'SELECT course_id, COUNT(*) FROM user_progress WHERE course_id = ANY($1) GROUP BY course_id',
        [coursesToDelete]
      );
      
      if (progressResult.rows.length > 0) {
        console.log('Warning: Found user_progress entries for courses to be deleted:');
        progressResult.rows.forEach(row => {
          console.log(`- Course ID ${row.course_id}: ${row.count} progress entries`);
        });
        
        // Delete these entries first
        console.log('Deleting related user_progress entries...');
        await client.query(
          'DELETE FROM user_progress WHERE course_id = ANY($1)',
          [coursesToDelete]
        );
      }
      
      // Now delete the courses
      const deleteResult = await client.query(
        'DELETE FROM courses WHERE id = ANY($1) RETURNING id',
        [coursesToDelete]
      );
      
      console.log(`Successfully deleted ${deleteResult.rows.length} duplicate courses`);
    } else {
      console.log('No duplicate courses to delete');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

run(); 