async function initCourses() {
  try {
    console.log('Sending POST request to initialize courses...')
    const response = await fetch('http://localhost:3001/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const text = await response.text()
    console.log('Raw response:', text)
    
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse response as JSON:', e)
      return
    }
    
    if (!response.ok) {
      console.error('Server responded with error:', data)
      throw new Error(`Failed to initialize courses: ${JSON.stringify(data)}`)
    }
    
    console.log('Courses initialized successfully:', data)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - Is the server running?:', error)
    } else {
      console.error('Error initializing courses:', error)
    }
  }
}

initCourses() 